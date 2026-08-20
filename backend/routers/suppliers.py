from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import SupplierModel, SupplierPerformanceHistoryModel
from backend.schemas import SupplierResponse

router = APIRouter(prefix="/api/suppliers", tags=["Supplier Management"])

@router.get("", response_model=List[SupplierResponse])
def get_suppliers(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(SupplierModel)
    if category:
        query = query.filter(SupplierModel.category.ilike(f"%{category}%"))
    return query.all()

@router.get("/scorecards")
def get_supplier_scorecards(organization_id: str = "ORG-DEFAULT", db: Session = Depends(get_db)):
    """
    Returns full supplier intelligence scorecards with dynamic trust scores, OTIF, defect rates,
    and historical delivery outcomes.
    """
    suppliers = db.query(SupplierModel).all()
    history = db.query(SupplierPerformanceHistoryModel).filter(
        SupplierPerformanceHistoryModel.organization_id == organization_id
    ).order_by(SupplierPerformanceHistoryModel.created_at.desc()).all()

    results = []
    for s in suppliers:
        s_history = [h for h in history if h.supplier_id == s.id or h.supplier_name == s.name]
        recent_delta = 0
        if s_history:
            recent_delta = s_history[0].updated_trust_score - s_history[0].previous_trust_score

        results.append({
            "id": s.id,
            "name": s.name,
            "location": s.location,
            "category": s.category,
            "vetted": s.vetted,
            "otif": s.otif,
            "defect_rate": s.defect_rate,
            "trust_score": s.trust_score,
            "recent_score_delta": recent_delta,
            "active_contracts": s.active_contracts,
            "lead_time_days": s.lead_time_days,
            "avatar": s.avatar,
            "completed_deliveries": len(s_history),
            "recent_outcomes": [
                {
                    "id": h.id,
                    "order_id": h.order_id,
                    "sku": h.sku,
                    "delivered_qty": h.delivered_quantity,
                    "defective_qty": h.defective_quantity,
                    "outcome_status": h.outcome_status,
                    "expected_days": h.expected_lead_time_days,
                    "actual_days": h.actual_lead_time_days,
                    "trust_delta": h.updated_trust_score - h.previous_trust_score,
                    "created_at": h.created_at.isoformat()
                }
                for h in s_history[:5]
            ]
        })
    return results

@router.get("/{supplier_id}/history")
def get_supplier_history(supplier_id: str, db: Session = Depends(get_db)):
    """
    Returns historical fulfillment performance records for a specific supplier.
    """
    history = db.query(SupplierPerformanceHistoryModel).filter(
        SupplierPerformanceHistoryModel.supplier_id == supplier_id
    ).order_by(SupplierPerformanceHistoryModel.created_at.desc()).all()

    return [
        {
            "id": h.id,
            "supplier_id": h.supplier_id,
            "supplier_name": h.supplier_name,
            "order_id": h.order_id,
            "po_number": h.po_number,
            "sku": h.sku,
            "delivered_quantity": h.delivered_quantity,
            "defective_quantity": h.defective_quantity,
            "expected_days": h.expected_lead_time_days,
            "actual_days": h.actual_lead_time_days,
            "outcome_status": h.outcome_status,
            "previous_trust_score": h.previous_trust_score,
            "updated_trust_score": h.updated_trust_score,
            "previous_otif": h.previous_otif,
            "updated_otif": h.updated_otif,
            "previous_defect_rate": h.previous_defect_rate,
            "updated_defect_rate": h.updated_defect_rate,
            "notes": h.notes,
            "created_at": h.created_at.isoformat()
        }
        for h in history
    ]

@router.get("/{supplier_id}", response_model=SupplierResponse)
def get_supplier_by_id(supplier_id: str, db: Session = Depends(get_db)):
    sup = db.query(SupplierModel).filter(SupplierModel.id == supplier_id).first()
    if not sup:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return sup
