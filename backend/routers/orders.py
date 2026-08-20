import json
import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import OrderModel, NotificationModel, InventoryModel
from backend.schemas import OrderCreate, OrderResponse, TimelineStep

router = APIRouter(prefix="/api/orders", tags=["Orders & Logistics"])

@router.get("", response_model=List[OrderResponse])
def get_all_orders(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(OrderModel)
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
            status_color=o.status_color,
            eta=o.eta,
            progress=o.progress,
            value=o.value,
            priority=o.priority,
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
        status_color=o.status_color,
        eta=o.eta,
        progress=o.progress,
        value=o.value,
        priority=o.priority,
        timeline=[TimelineStep(**t) for t in timeline]
    )

@router.post("", response_model=OrderResponse)
def create_order(req: OrderCreate, db: Session = Depends(get_db)):
    order_id = f"ORD-{random.randint(9000, 9999)}"
    timeline = [
        {"time": "Just now", "title": "Order Dispatched to Supplier", "desc": "Electronic procurement PO confirmed", "done": True},
        {"time": "Tomorrow 08:00", "title": "Origin Warehouse Packaging", "desc": "Awaiting container consolidation", "done": False},
        {"time": req.eta or "Oct 29", "title": "Destination Delivery", "desc": "Delivery to destination dock", "done": False}
    ]

    new_order = OrderModel(
        id=order_id,
        item=req.item,
        sku=req.sku,
        supplier=req.supplier,
        origin=req.origin or "Shenzhen, CN",
        destination=req.destination or "Chicago Hub (ORD-3)",
        carrier=req.carrier or "DHL Global Express",
        status="In Transit",
        status_color="tertiary",
        eta=req.eta or "Oct 29, 2026",
        progress=10,
        value=req.value or "$120,000",
        priority=req.priority or "High",
        timeline_json=json.dumps(timeline)
    )
    db.add(new_order)

    # Deduct stock for matching inventory SKU
    if req.sku:
        inv_item = db.query(InventoryModel).filter(InventoryModel.sku == req.sku).first()
        if inv_item:
            inv_item.on_hand = max(0, inv_item.on_hand - 500)
            if inv_item.on_hand < inv_item.min_safety:
                inv_item.status = "Critical Low" if inv_item.on_hand > 0 else "Out of Stock"
                inv_item.status_color = "error"

    # Add notification
    db.add(NotificationModel(
        id=f"NOTIF-{random.randint(1000, 9999)}",
        title=f"Order {order_id} created for {req.item} ({req.supplier})",
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
