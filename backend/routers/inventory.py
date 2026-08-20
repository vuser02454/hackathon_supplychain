from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import InventoryModel
from backend.schemas import InventoryItemResponse

router = APIRouter(prefix="/api/inventory", tags=["Inventory Intelligence"])

@router.get("", response_model=List[InventoryItemResponse])
def get_inventory(category: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(InventoryModel)
    if category:
        query = query.filter(InventoryModel.category.ilike(f"%{category}%"))
    if status:
        query = query.filter(InventoryModel.status.ilike(f"%{status}%"))
    return query.all()

@router.get("/{sku}", response_model=InventoryItemResponse)
def get_inventory_item(sku: str, db: Session = Depends(get_db)):
    item = db.query(InventoryModel).filter(InventoryModel.sku == sku).first()
    if not item:
        raise HTTPException(status_code=404, detail="SKU not found")
    return item
