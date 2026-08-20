from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import SupplierModel
from backend.schemas import SupplierResponse

router = APIRouter(prefix="/api/suppliers", tags=["Supplier Management"])

@router.get("", response_model=List[SupplierResponse])
def get_suppliers(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(SupplierModel)
    if category:
        query = query.filter(SupplierModel.category.ilike(f"%{category}%"))
    return query.all()

@router.get("/{supplier_id}", response_model=SupplierResponse)
def get_supplier_by_id(supplier_id: str, db: Session = Depends(get_db)):
    sup = db.query(SupplierModel).filter(SupplierModel.id == supplier_id).first()
    if not sup:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return sup
