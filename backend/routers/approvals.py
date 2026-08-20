import json
import random
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import RestockApprovalModel, OrderModel, InventoryModel, NotificationModel
from backend.schemas import RestockApprovalCreate, RestockApprovalResponse, VendorQuote

router = APIRouter(prefix="/api/approvals", tags=["Restock Approvals"])

@router.get("", response_model=List[RestockApprovalResponse])
def get_approvals(db: Session = Depends(get_db)):
    approvals = db.query(RestockApprovalModel).all()
    result = []
    for a in approvals:
        quotes = []
        if a.quotes_json:
            try:
                quotes = json.loads(a.quotes_json)
            except Exception:
                quotes = []
        result.append(RestockApprovalResponse(
            id=a.id,
            po_number=a.po_number,
            sku=a.sku,
            item=a.item,
            qty=a.qty,
            total_cost=a.total_cost,
            unit_price=a.unit_price,
            supplier=a.supplier,
            urgency=a.urgency,
            status=a.status,
            reason=a.reason,
            financial_impact=a.financial_impact,
            confidence_score=a.confidence_score or "91.0%",
            quotes=[VendorQuote(**q) for q in quotes]
        ))
    return result

@router.post("", response_model=RestockApprovalResponse)
def create_restock_approval(req: RestockApprovalCreate, organization_id: str = "ORG-DEFAULT", db: Session = Depends(get_db)):
    apv_id = f"APV-{random.randint(1000, 9999)}"
    quotes_json_str = json.dumps([q.dict() for q in req.quotes]) if req.quotes else None

    new_apv = RestockApprovalModel(
        id=apv_id,
        organization_id=organization_id,
        po_number=req.po_number,
        sku=req.sku,
        item=req.item,
        qty=req.qty,
        total_cost=req.total_cost,
        unit_price=req.unit_price,
        supplier=req.supplier,
        urgency=req.urgency or "Critical",
        status=req.status or "APPROVED / PAYMENT_PENDING",
        reason=req.reason,
        financial_impact=req.financial_impact,
        confidence_score=req.confidence_score or "91.0%",
        quotes_json=quotes_json_str
    )
    db.add(new_apv)
    db.commit()
    db.refresh(new_apv)

    return RestockApprovalResponse(
        id=new_apv.id,
        po_number=new_apv.po_number,
        sku=new_apv.sku,
        item=new_apv.item,
        qty=new_apv.qty,
        total_cost=new_apv.total_cost,
        unit_price=new_apv.unit_price,
        supplier=new_apv.supplier,
        urgency=new_apv.urgency,
        status=new_apv.status,
        reason=new_apv.reason,
        financial_impact=new_apv.financial_impact,
        confidence_score=new_apv.confidence_score,
        quotes=req.quotes or []
    )

@router.post("/{approval_id}/approve")
def approve_restock_po(approval_id: str, db: Session = Depends(get_db)):
    apv = db.query(RestockApprovalModel).filter(RestockApprovalModel.id == approval_id).first()
    if not apv:
        raise HTTPException(status_code=404, detail="Approval not found")

    apv.status = "Approved & Dispatched"

    # Create active Order
    order_id = f"ORD-{random.randint(9000, 9999)}"
    timeline = [
        {"time": "Just now", "title": "Electronic PO Signed & Transmitted to ERP", "desc": f"SAP/NetSuite PO {apv.po_number} cleared authorization threshold.", "done": True},
        {"time": "In 4 hours", "title": "Supplier Automated Production Schedule", "desc": "Supplier ERP confirmed batch allocation.", "done": False},
        {"time": "Oct 24, Scheduled", "title": "Air Freight Cargo Handover", "desc": "Pre-manifest filed with customs.", "done": False}
    ]
    new_order = OrderModel(
        id=order_id,
        item=apv.item,
        sku=apv.sku,
        supplier=apv.supplier,
        origin="Shenzhen / Hsinchu Hub",
        destination="Munich Assembly Facility",
        carrier="Express Autonomous Freight (Air Priority)",
        status="In Transit",
        status_color="tertiary",
        eta="In 5 Business Days",
        progress=15,
        value=apv.total_cost,
        priority=apv.urgency,
        timeline_json=json.dumps(timeline)
    )
    db.add(new_order)

    # Update Inventory Incoming stock
    inv = db.query(InventoryModel).filter(InventoryModel.sku == apv.sku).first()
    if inv:
        inv.incoming = (inv.incoming or 0) + apv.qty
        inv.status = "Incoming Replenishment"
        inv.status_color = "tertiary"

    # Log notification
    db.add(NotificationModel(
        id=f"NOTIF-{random.randint(1000, 9999)}",
        title=f"PO {apv.po_number} Authorized & Dispatched to ERP",
        time_label="Just now",
        is_read=False,
        notif_type="transit"
    ))

    db.commit()
    return {"message": "PO Approved", "po_number": apv.po_number, "order_id": order_id}

@router.post("/{approval_id}/reject")
def reject_restock_po(approval_id: str, db: Session = Depends(get_db)):
    apv = db.query(RestockApprovalModel).filter(RestockApprovalModel.id == approval_id).first()
    if not apv:
        raise HTTPException(status_code=404, detail="Approval not found")
    apv.status = "Rejected"
    db.commit()
    return {"message": "PO Rejected & Archived", "po_number": apv.po_number}
