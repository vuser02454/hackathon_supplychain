from typing import List, Optional, Dict, Any
from datetime import datetime
import json
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import InventoryModel, InventoryAlertModel, UserModel, SupplierModel
from backend.schemas import (
    InventoryItemResponse,
    InventoryAlertResponse,
    StockCheckResponse,
    SimulateStockoutRequest,
    RestockRecommendationResponse
)
from backend.email_service import send_low_stock_email
from backend.ai_service import ai_service
from backend.supabase_service import sync_inventory_alert_to_supabase, resolve_alert_in_supabase

router = APIRouter(prefix="/api/inventory", tags=["Inventory Intelligence"])

@router.get("", response_model=List[InventoryItemResponse])
def get_inventory(category: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(InventoryModel)
    if category:
        query = query.filter(InventoryModel.category.ilike(f"%{category}%"))
    if status:
        query = query.filter(InventoryModel.status.ilike(f"%{status}%"))
    return query.all()

@router.get("/alerts", response_model=List[InventoryAlertResponse])
def get_inventory_alerts(
    organization_id: str = "ORG-DEFAULT",
    severity: Optional[str] = None,
    is_read: Optional[bool] = None,
    unresolved_only: bool = True,
    db: Session = Depends(get_db)
):
    """
    Retrieves all inventory alerts for the organization with optional severity and read status filters.
    """
    query = db.query(InventoryAlertModel).filter(InventoryAlertModel.organization_id == organization_id)
    if severity:
        query = query.filter(InventoryAlertModel.severity == severity.upper())
    if is_read is not None:
        query = query.filter(InventoryAlertModel.is_read == is_read)
    if unresolved_only:
        query = query.filter(InventoryAlertModel.resolved_at == None)
    
    alerts = query.order_by(InventoryAlertModel.created_at.desc()).all()
    
    results = []
    for a in alerts:
        ai_rec = None
        if a.ai_recommendation_json:
            try:
                ai_rec = json.loads(a.ai_recommendation_json)
            except Exception:
                ai_rec = None
        
        results.append(InventoryAlertResponse(
            id=a.id,
            organization_id=a.organization_id,
            inventory_id=a.inventory_id,
            sku=a.sku,
            product_name=a.product_name,
            warehouse=a.warehouse,
            current_stock=a.current_stock,
            safety_stock=a.safety_stock,
            reorder_point=a.reorder_point,
            severity=a.severity,
            message=a.message,
            is_read=a.is_read,
            email_sent=a.email_sent,
            ai_recommendation=ai_rec,
            created_at=a.created_at,
            resolved_at=a.resolved_at
        ))
    return results

@router.get("/alerts/unread")
def get_unread_alerts_summary(organization_id: str = "ORG-DEFAULT", db: Session = Depends(get_db)):
    """
    Returns unread count and latest unread alerts for top navigation bell.
    """
    unread_alerts = db.query(InventoryAlertModel).filter(
        InventoryAlertModel.organization_id == organization_id,
        InventoryAlertModel.is_read == False,
        InventoryAlertModel.resolved_at == None
    ).order_by(InventoryAlertModel.created_at.desc()).limit(10).all()

    critical_count = sum(1 for a in unread_alerts if a.severity == "CRITICAL")
    low_count = sum(1 for a in unread_alerts if a.severity == "LOW")

    return {
        "unread_count": len(unread_alerts),
        "critical_count": critical_count,
        "low_count": low_count,
        "has_critical": critical_count > 0,
        "alerts": [
            {
                "id": a.id,
                "sku": a.sku,
                "product_name": a.product_name,
                "warehouse": a.warehouse,
                "current_stock": a.current_stock,
                "reorder_point": a.reorder_point,
                "severity": a.severity,
                "message": a.message,
                "email_sent": a.email_sent,
                "created_at": a.created_at.isoformat()
            }
            for a in unread_alerts
        ]
    }

@router.post("/alerts/{alert_id}/read")
def mark_alert_as_read(alert_id: str, db: Session = Depends(get_db)):
    """
    Marks an alert as read.
    """
    alert = db.query(InventoryAlertModel).filter(InventoryAlertModel.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_read = True
    db.commit()
    return {"status": "success", "id": alert_id, "is_read": True}

@router.post("/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: str, db: Session = Depends(get_db)):
    """
    Marks an alert as resolved.
    """
    alert = db.query(InventoryAlertModel).filter(InventoryAlertModel.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.resolved_at = datetime.utcnow()
    db.commit()
    resolve_alert_in_supabase(alert_id)
    return {"status": "success", "id": alert_id, "resolved_at": alert.resolved_at.isoformat()}

@router.post("/check-stock", response_model=StockCheckResponse)
def check_stock_and_notify(
    organization_id: str = "ORG-DEFAULT",
    recipient_email: Optional[str] = None,
    recipient_name: Optional[str] = None,
    send_emails: bool = True,
    db: Session = Depends(get_db)
):
    """
    Scans inventory against safety thresholds, prevents duplicate emails, 
    dispatches emails to the logged-in user's email for new low/critical events, 
    and marks replenished items as resolved.
    """
    items = db.query(InventoryModel).all()
    user = db.query(UserModel).filter(UserModel.organization_id == organization_id).first() or db.query(UserModel).first()
    
    # Dynamically resolve recipient from active user or database record
    user_email = recipient_email or (user.email if user and user.email else "user@supplychain.ai")
    user_name = recipient_name or (user.name if user and user.name else "Supply Chain Lead")

    normal_count = 0
    low_count = 0
    critical_count = 0
    alerts_created = 0
    alerts_resolved = 0
    active_alert_responses = []

    for item in items:
        on_hand = int(item.on_hand or 0)
        min_safety = int(item.min_safety or 100)
        critical_threshold = int(min_safety * 0.5)

        if on_hand <= critical_threshold:
            severity = "CRITICAL"
            status_text = "Critical Low"
            status_color = "error"
            critical_count += 1
        elif on_hand <= min_safety:
            severity = "LOW"
            status_text = "Low Buffer"
            status_color = "primary-container"
            low_count += 1
        else:
            severity = "NORMAL"
            status_text = "Optimal"
            status_color = "tertiary"
            normal_count += 1

        # Update item status in inventory table
        if item.status != status_text:
            item.status = status_text
            item.status_color = status_color

        if severity in ("LOW", "CRITICAL"):
            # Check for existing unresolved alert to prevent duplicate spamming
            existing_unresolved = db.query(InventoryAlertModel).filter(
                InventoryAlertModel.organization_id == organization_id,
                InventoryAlertModel.sku == item.sku,
                InventoryAlertModel.severity == severity,
                InventoryAlertModel.resolved_at == None
            ).first()

            if existing_unresolved:
                # Update current stock and timestamp if changed
                existing_unresolved.current_stock = on_hand
                ai_rec = json.loads(existing_unresolved.ai_recommendation_json) if existing_unresolved.ai_recommendation_json else None
                active_alert_responses.append(InventoryAlertResponse(
                    id=existing_unresolved.id,
                    organization_id=existing_unresolved.organization_id,
                    inventory_id=existing_unresolved.inventory_id,
                    sku=existing_unresolved.sku,
                    product_name=existing_unresolved.product_name,
                    warehouse=existing_unresolved.warehouse,
                    current_stock=existing_unresolved.current_stock,
                    safety_stock=existing_unresolved.safety_stock,
                    reorder_point=existing_unresolved.reorder_point,
                    severity=existing_unresolved.severity,
                    message=existing_unresolved.message,
                    is_read=existing_unresolved.is_read,
                    email_sent=existing_unresolved.email_sent,
                    ai_recommendation=ai_rec,
                    created_at=existing_unresolved.created_at,
                    resolved_at=existing_unresolved.resolved_at
                ))
            else:
                # NEW Alert: Generate AI recommendation and dispatch email
                supplier = db.query(SupplierModel).first()
                supplier_dict = {
                    "name": supplier.name if supplier else "Apex Organic Produce",
                    "lead_time_days": getattr(supplier, "lead_time_days", 3) if supplier else 3,
                    "otif": getattr(supplier, "otif", "99.4%") if supplier else "99.4%"
                }
                
                ai_rec = ai_service.generate_low_stock_restock_plan(
                    item={
                        "sku": item.sku,
                        "name": item.name,
                        "warehouse": item.warehouse,
                        "on_hand": on_hand,
                        "min_safety": min_safety,
                        "unit_cost": item.unit_cost
                    },
                    alert_severity=severity,
                    supplier_info=supplier_dict
                )

                alert_id = f"ALT-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
                alert_msg = (
                    f"🚨 Critical Stock Alert: {item.name} ({item.sku}) at {item.warehouse} is at {on_hand} units "
                    f"(Reorder Point: {min_safety}). Potential stockout within {ai_rec.get('days_until_stockout', 1.5)} days."
                    if severity == "CRITICAL" else
                    f"⚠️ Low Stock Alert: {item.name} ({item.sku}) at {item.warehouse} is at {on_hand} units "
                    f"(Reorder Point: {min_safety}). AI recommends restocking {ai_rec.get('recommended_quantity', 150)} units."
                )

                email_result = {"success": False}
                if send_emails:
                    email_result = send_low_stock_email(
                        user_email=user_email,
                        user_name=user_name,
                        inventory_item={"sku": item.sku, "name": item.name, "warehouse": item.warehouse, "on_hand": on_hand, "min_safety": min_safety},
                        alert_data={"sku": item.sku, "current_stock": on_hand, "reorder_point": min_safety, "severity": severity},
                        ai_recommendation=ai_rec
                    )

                new_alert = InventoryAlertModel(
                    id=alert_id,
                    organization_id=organization_id,
                    inventory_id=item.sku,
                    sku=item.sku,
                    product_name=item.name,
                    warehouse=item.warehouse,
                    current_stock=on_hand,
                    safety_stock=min_safety,
                    reorder_point=min_safety,
                    severity=severity,
                    message=alert_msg,
                    is_read=False,
                    email_sent=bool(email_result.get("success", False)),
                    ai_recommendation_json=json.dumps(ai_rec),
                    created_at=datetime.utcnow()
                )
                db.add(new_alert)
                alerts_created += 1

                # Sync to Supabase in background
                sync_inventory_alert_to_supabase({
                    "id": alert_id,
                    "organization_id": organization_id,
                    "inventory_id": item.sku,
                    "sku": item.sku,
                    "product_name": item.name,
                    "warehouse": item.warehouse,
                    "current_stock": on_hand,
                    "reorder_point": min_safety,
                    "severity": severity,
                    "message": alert_msg,
                    "is_read": False,
                    "email_sent": bool(email_result.get("success", False))
                })

                active_alert_responses.append(InventoryAlertResponse(
                    id=new_alert.id,
                    organization_id=new_alert.organization_id,
                    inventory_id=new_alert.inventory_id,
                    sku=new_alert.sku,
                    product_name=new_alert.product_name,
                    warehouse=new_alert.warehouse,
                    current_stock=new_alert.current_stock,
                    safety_stock=new_alert.safety_stock,
                    reorder_point=new_alert.reorder_point,
                    severity=new_alert.severity,
                    message=new_alert.message,
                    is_read=new_alert.is_read,
                    email_sent=new_alert.email_sent,
                    ai_recommendation=ai_rec,
                    created_at=new_alert.created_at,
                    resolved_at=None
                ))
        else:
            # NORMAL stock: Resolve any open alerts for this SKU
            open_alerts = db.query(InventoryAlertModel).filter(
                InventoryAlertModel.organization_id == organization_id,
                InventoryAlertModel.sku == item.sku,
                InventoryAlertModel.resolved_at == None
            ).all()

            for oa in open_alerts:
                oa.resolved_at = datetime.utcnow()
                alerts_resolved += 1
                resolve_alert_in_supabase(oa.id)

    db.commit()

    return StockCheckResponse(
        status="success",
        total_scanned=len(items),
        normal_count=normal_count,
        low_count=low_count,
        critical_count=critical_count,
        alerts_created=alerts_created,
        alerts_resolved=alerts_resolved,
        alerts=active_alert_responses
    )

@router.post("/simulate-stockout")
def simulate_stockout_for_demo(
    req: SimulateStockoutRequest,
    organization_id: str = "ORG-DEFAULT",
    db: Session = Depends(get_db)
):
    """
    Hackathon Demo Trigger: Drops stock for the specified SKU below critical threshold,
    triggers stock scan, sends email, and returns immediate critical alert & AI recommendation.
    """
    item = db.query(InventoryModel).filter(InventoryModel.sku == req.sku).first()
    if not item:
        # Fallback to first item if SKU not found
        item = db.query(InventoryModel).first()
        if not item:
            raise HTTPException(status_code=404, detail="No inventory items available to simulate")
    
    # Drop stock to critical level
    item.on_hand = req.simulated_stock if req.simulated_stock is not None else 18
    item.status = "Critical Low"
    item.status_color = "error"
    db.commit()

    # Trigger stock scan & email notification
    scan_res = check_stock_and_notify(organization_id=organization_id, send_emails=True, db=db)

    # Get latest alert for this SKU
    latest_alert = db.query(InventoryAlertModel).filter(
        InventoryAlertModel.sku == item.sku,
        InventoryAlertModel.resolved_at == None
    ).order_by(InventoryAlertModel.created_at.desc()).first()

    ai_rec = None
    if latest_alert and latest_alert.ai_recommendation_json:
        ai_rec = json.loads(latest_alert.ai_recommendation_json)

    return {
        "status": "success",
        "message": f"Demo stockout simulated for {item.name} ({item.sku}). Stock dropped to {item.on_hand} units.",
        "simulated_sku": item.sku,
        "product_name": item.name,
        "current_stock": item.on_hand,
        "reorder_point": item.min_safety,
        "alert": latest_alert.id if latest_alert else None,
        "severity": latest_alert.severity if latest_alert else "CRITICAL",
        "email_dispatched": latest_alert.email_sent if latest_alert else False,
        "ai_recommendation": ai_rec,
        "summary": {
            "total_scanned": scan_res.total_scanned,
            "critical_count": scan_res.critical_count,
            "low_count": scan_res.low_count,
            "normal_count": scan_res.normal_count
        }
    }

@router.post("/{sku}/restock-recommendation", response_model=RestockRecommendationResponse)
def get_sku_restock_recommendation(sku: str, db: Session = Depends(get_db)):
    """
    Computes real-time AI restock proposal for any SKU.
    """
    item = db.query(InventoryModel).filter(InventoryModel.sku == sku).first()
    if not item:
        raise HTTPException(status_code=404, detail="SKU not found")

    supplier = db.query(SupplierModel).first()
    supplier_dict = {
        "name": supplier.name if supplier else "Apex Organic Produce",
        "lead_time_days": getattr(supplier, "lead_time_days", 3) if supplier else 3,
        "otif": getattr(supplier, "otif", "99.4%") if supplier else "99.4%"
    }

    on_hand = int(item.on_hand or 0)
    min_safety = int(item.min_safety or 100)
    severity = "CRITICAL" if on_hand <= min_safety * 0.5 else ("LOW" if on_hand <= min_safety else "NORMAL")

    rec = ai_service.generate_low_stock_restock_plan(
        item={
            "sku": item.sku,
            "name": item.name,
            "warehouse": item.warehouse,
            "on_hand": on_hand,
            "min_safety": min_safety,
            "unit_cost": item.unit_cost
        },
        alert_severity=severity,
        supplier_info=supplier_dict
    )
    return RestockRecommendationResponse(**rec)

@router.get("/{sku}", response_model=InventoryItemResponse)
def get_inventory_item(sku: str, db: Session = Depends(get_db)):
    item = db.query(InventoryModel).filter(InventoryModel.sku == sku).first()
    if not item:
        raise HTTPException(status_code=404, detail="SKU not found")
    return item
