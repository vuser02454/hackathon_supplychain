import json
import random
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import (
    OrderModel,
    NotificationModel,
    InventoryModel,
    SupplierModel,
    SupplierPerformanceHistoryModel,
    InventoryAlertModel,
    RestockApprovalModel
)
from backend.schemas import (
    OrderCreate,
    OrderResponse,
    TimelineStep,
    DeliveryOutcomeRequest,
    DeliveryOutcomeResponse
)

router = APIRouter(prefix="/api/orders", tags=["Orders & Logistics"])

@router.get("", response_model=List[OrderResponse])
def get_all_orders(
    status: Optional[str] = None,
    organization_id: str = "ORG-DEFAULT",
    db: Session = Depends(get_db)
):
    query = db.query(OrderModel).filter(OrderModel.organization_id == organization_id)
    if status:
        query = query.filter(OrderModel.status.ilike(f"%{status}%"))
    orders = query.order_by(OrderModel.created_at.desc()).all()

    result = []
    for o in orders:
        timeline = []
        if o.timeline_json:
            try:
                timeline = json.loads(o.timeline_json)
            except Exception:
                timeline = []
        result.append(OrderResponse(
            id=o.id,
            item=o.item,
            sku=o.sku,
            supplier=o.supplier,
            origin=o.origin,
            destination=o.destination,
            carrier=o.carrier,
            status=o.status,
            status_color=o.status_color or "tertiary",
            eta=o.eta,
            progress=o.progress or 10,
            value=o.value,
            priority=o.priority or "High",
            timeline=[TimelineStep(**t) for t in timeline]
        ))
    return result

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(order_id: str, db: Session = Depends(get_db)):
    o = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Order not found")
    timeline = []
    if o.timeline_json:
        try:
            timeline = json.loads(o.timeline_json)
        except Exception:
            timeline = []
    return OrderResponse(
        id=o.id,
        item=o.item,
        sku=o.sku,
        supplier=o.supplier,
        origin=o.origin,
        destination=o.destination,
        carrier=o.carrier,
        status=o.status,
        status_color=o.status_color or "tertiary",
        eta=o.eta,
        progress=o.progress or 10,
        value=o.value,
        priority=o.priority or "High",
        timeline=[TimelineStep(**t) for t in timeline]
    )

@router.post("", response_model=OrderResponse)
def create_order(req: OrderCreate, organization_id: str = "ORG-DEFAULT", db: Session = Depends(get_db)):
    order_id = f"ORD-{random.randint(9000, 9999)}"
    timeline = [
        {"time": "Just now", "title": "Electronic PO Confirmed", "desc": "Autonomous dispatch into logistics lane", "done": True},
        {"time": "In 12h", "title": "Origin Packing & Staging", "desc": "Consolidation at regional export facility", "done": False},
        {"time": "In 24h", "title": "Customs Export Manifest", "desc": "Cleared export documentation", "done": False},
        {"time": req.eta or "Oct 29", "title": "Final Dock Delivery", "desc": "Arrived at destination receiving dock", "done": False}
    ]

    new_order = OrderModel(
        id=order_id,
        organization_id=organization_id,
        item=req.item,
        sku=req.sku,
        supplier=req.supplier,
        origin=req.origin or "Shenzhen, CN",
        destination=req.destination or "Chicago Hub (ORD-3)",
        carrier=req.carrier or "DHL Global Express",
        status="SHIPMENT_CREATED",
        status_color="primary-container",
        eta=req.eta or "Oct 29, 2026",
        progress=25,
        value=req.value or "₹120,000",
        priority=req.priority or "High",
        is_simulated_telemetry=True,
        timeline_json=json.dumps(timeline)
    )
    db.add(new_order)

    # Add notification
    db.add(NotificationModel(
        id=f"NOTIF-{random.randint(1000, 9999)}",
        organization_id=organization_id,
        title=f"Shipment {order_id} created for {req.item} ({req.supplier})",
        time_label="Just now",
        is_read=False,
        notif_type="transit"
    ))

    db.commit()
    db.refresh(new_order)

    return OrderResponse(
        id=new_order.id,
        item=new_order.item,
        sku=new_order.sku,
        supplier=new_order.supplier,
        origin=new_order.origin,
        destination=new_order.destination,
        carrier=new_order.carrier,
        status=new_order.status,
        status_color=new_order.status_color,
        eta=new_order.eta,
        progress=new_order.progress,
        value=new_order.value,
        priority=new_order.priority,
        timeline=[TimelineStep(**t) for t in timeline]
    )

@router.post("/{order_id}/advance-status", response_model=OrderResponse)
def advance_shipment_status(order_id: str, db: Session = Depends(get_db)):
    """
    Advances a shipment stage: SHIPMENT_CREATED (25%) -> IN_TRANSIT (68%) -> DELIVERED (100%).
    """
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    timeline = []
    if order.timeline_json:
        try:
            timeline = json.loads(order.timeline_json)
        except Exception:
            timeline = []

    if order.status in ("SHIPMENT_CREATED", "PAID"):
        order.status = "IN_TRANSIT"
        order.status_color = "primary-container"
        order.progress = 68
        if len(timeline) > 1:
            timeline[1]["done"] = True
        if len(timeline) > 2:
            timeline[2]["done"] = True
    elif order.status in ("IN_TRANSIT", "In Transit"):
        # Auto-complete delivery with default standard outcome
        return complete_shipment_delivery(
            order_id=order_id,
            outcome_req=DeliveryOutcomeRequest(
                delivered_quantity=500,
                defective_quantity=0,
                actual_lead_time_days=3,
                notes="Delivered on-time with zero defects. Telemetry verified."
            ),
            db=db
        )

    order.timeline_json = json.dumps(timeline)
    db.commit()
    db.refresh(order)

    return OrderResponse(
        id=order.id,
        item=order.item,
        sku=order.sku,
        supplier=order.supplier,
        origin=order.origin,
        destination=order.destination,
        carrier=order.carrier,
        status=order.status,
        status_color=order.status_color or "tertiary",
        eta=order.eta,
        progress=order.progress or 50,
        value=order.value,
        priority=order.priority or "High",
        timeline=[TimelineStep(**t) for t in timeline]
    )

@router.post("/{order_id}/complete-delivery", response_model=DeliveryOutcomeResponse)
def complete_shipment_delivery(
    order_id: str,
    outcome_req: DeliveryOutcomeRequest,
    organization_id: str = "ORG-DEFAULT",
    db: Session = Depends(get_db)
):
    """
    CLOSED-LOOP OUTCOME & SUPPLIER LEARNING STEP:
    1. Marks order/shipment DELIVERED (100% progress).
    2. Recalculates supplier trust score (+7 pts for on-time/early 0 defects), OTIF, and defect rate.
    3. Logs record into supplier_performance_history for future AI recommendation learning.
    4. Replenishes inventory balance and resolves open low-stock alerts.
    """
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # 1. Update Order Status
    order.status = "DELIVERED"
    order.status_color = "tertiary"
    order.progress = 100
    order.delivered_quantity = outcome_req.delivered_quantity
    order.defective_quantity = outcome_req.defective_quantity
    order.actual_days = outcome_req.actual_lead_time_days

    # Update timeline
    timeline = []
    if order.timeline_json:
        try:
            timeline = json.loads(order.timeline_json)
            for t in timeline:
                t["done"] = True
        except Exception:
            timeline = []
    order.timeline_json = json.dumps(timeline)

    # 2. Update Supplier Performance & Learning Loop
    supplier = db.query(SupplierModel).filter(
        (SupplierModel.name == order.supplier) | 
        (SupplierModel.name.ilike(f"%{order.supplier[:6]}%"))
    ).first()

    if not supplier:
        supplier = db.query(SupplierModel).first()

    supplier_id = supplier.id if supplier else "SUP-01"
    supplier_name = supplier.name if supplier else order.supplier
    prev_trust = supplier.trust_score if supplier else 84
    prev_otif = supplier.otif if supplier else "91.0%"
    prev_defect = supplier.defect_rate if supplier else "2.4%"
    expected_days = getattr(supplier, "lead_time_days", 4) if supplier else 4

    # Outcome evaluation
    if outcome_req.actual_lead_time_days < expected_days:
        outcome_status = "DELIVERED_EARLY"
        trust_delta = 7
    elif outcome_req.actual_lead_time_days == expected_days and outcome_req.defective_quantity == 0:
        outcome_status = "DELIVERED_ON_TIME"
        trust_delta = 5
    else:
        outcome_status = "DELIVERED_LATE"
        trust_delta = -3

    updated_trust = min(99, max(50, prev_trust + trust_delta))
    updated_otif = "96.5%" if outcome_status in ("DELIVERED_EARLY", "DELIVERED_ON_TIME") else "89.0%"
    updated_defect = "1.2%" if outcome_req.defective_quantity == 0 else "3.8%"

    if supplier:
        supplier.trust_score = updated_trust
        supplier.otif = updated_otif
        supplier.defect_rate = updated_defect

    # 3. Record in supplier_performance_history
    history_id = f"SPH-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
    history_entry = SupplierPerformanceHistoryModel(
        id=history_id,
        organization_id=organization_id,
        supplier_id=supplier_id,
        supplier_name=supplier_name,
        order_id=order.id,
        po_number=order.po_number,
        sku=order.sku,
        delivered_quantity=outcome_req.delivered_quantity,
        defective_quantity=outcome_req.defective_quantity,
        expected_lead_time_days=expected_days,
        actual_lead_time_days=outcome_req.actual_lead_time_days,
        outcome_status=outcome_status,
        previous_trust_score=prev_trust,
        updated_trust_score=updated_trust,
        previous_otif=prev_otif,
        updated_otif=updated_otif,
        previous_defect_rate=prev_defect,
        updated_defect_rate=updated_defect,
        notes=outcome_req.notes,
        created_at=datetime.utcnow()
    )
    db.add(history_entry)

    # 4. Replenish Inventory Balance
    inv = db.query(InventoryModel).filter(InventoryModel.sku == order.sku).first()
    if inv:
        inv.on_hand = (inv.on_hand or 0) + outcome_req.delivered_quantity
        inv.incoming = max(0, (inv.incoming or 0) - outcome_req.delivered_quantity)
        if inv.on_hand >= (inv.min_safety or 100):
            inv.status = "Optimal"
            inv.status_color = "tertiary"

    # 5. Resolve Open Inventory Alerts for this SKU
    resolved_count = 0
    open_alerts = db.query(InventoryAlertModel).filter(
        InventoryAlertModel.sku == order.sku,
        InventoryAlertModel.resolved_at == None
    ).all()
    for oa in open_alerts:
        oa.resolved_at = datetime.utcnow()
        resolved_count += 1

    # Add milestone notification
    db.add(NotificationModel(
        id=f"NOTIF-{random.randint(1000, 9999)}",
        organization_id=organization_id,
        title=f"Delivery Completed: {order.id}. Supplier {supplier_name} trust score updated ({prev_trust} -> {updated_trust})",
        time_label="Just now",
        is_read=False,
        notif_type="supplier"
    ))

    db.commit()

    return DeliveryOutcomeResponse(
        order_id=order.id,
        supplier_id=supplier_id,
        supplier_name=supplier_name,
        sku=order.sku,
        delivered_quantity=outcome_req.delivered_quantity,
        defective_quantity=outcome_req.defective_quantity,
        expected_days=expected_days,
        actual_days=outcome_req.actual_lead_time_days,
        outcome_status=outcome_status,
        previous_trust_score=prev_trust,
        updated_trust_score=updated_trust,
        previous_otif=prev_otif,
        updated_otif=updated_otif,
        previous_defect_rate=prev_defect,
        updated_defect_rate=updated_defect,
        score_delta=trust_delta,
        restock_resolved_alerts=resolved_count,
        message=f"Delivery recorded successfully. Supplier trust score updated from {prev_trust} to {updated_trust} (+{trust_delta} pts)."
    )
