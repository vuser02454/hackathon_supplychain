from typing import List, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import SupplierModel
from backend.schemas import SustainabilitySummaryResponse, SupplierSustainabilityItem

router = APIRouter(prefix="/api/sustainability", tags=["Sustainability & Carbon Intelligence"])

# Configurable transport emission factors (kg CO2 / tonne-km)
EMISSION_FACTORS: Dict[str, float] = {
    "AIR": 0.500,
    "ROAD": 0.105,
    "RAIL": 0.028,
    "OCEAN": 0.015
}

@router.get("/summary", response_model=SustainabilitySummaryResponse)
def get_sustainability_summary(db: Session = Depends(get_db)):
    """
    Returns aggregate estimated carbon footprint, average sustainability score,
    transport mode distribution, and vendor ranking.
    """
    suppliers = db.query(SupplierModel).all()
    
    total_co2_kg = 0.0
    total_score = 0
    mode_counts = {"ROAD": 0, "RAIL": 0, "OCEAN": 0, "AIR": 0}
    supplier_items: List[SupplierSustainabilityItem] = []

    for sup in suppliers:
        mode = (sup.transport_mode or "ROAD").upper()
        mode_counts[mode] = mode_counts.get(mode, 0) + 1
        
        factor = EMISSION_FACTORS.get(mode, 0.105)
        dist = sup.distance_km or 450.0
        weight_tonnes = 5.0 # Standard batch assumption (5,000 kg)
        co2_est = round(dist * weight_tonnes * factor, 1)
        
        carb_score = sup.carbon_score or 85
        total_co2_kg += co2_est
        total_score += carb_score

        rank = sup.sustainability_rank or ("A+" if carb_score >= 90 else ("A" if carb_score >= 80 else ("B" if carb_score >= 70 else "C")))

        rec = (
            f"{sup.name} leverages {mode} transport ({co2_est} kg est. CO₂) "
            f"maintaining a {rank} sustainability rating."
        )

        supplier_items.append(SupplierSustainabilityItem(
            supplier_id=sup.id,
            supplier_name=sup.name,
            supplier_tier=sup.supplier_tier or "TIER_1",
            location=sup.location,
            transport_mode=mode,
            distance_km=dist,
            shipment_weight_kg=5000.0,
            carbon_emission_factor=factor,
            estimated_co2_kg=co2_est,
            carbon_score=carb_score,
            sustainability_rank=rank,
            ai_recommendation=rec
        ))

    avg_score = round(total_score / max(len(suppliers), 1))
    cleanest = min(supplier_items, key=lambda x: x.estimated_co2_kg).supplier_name if supplier_items else "Nordic Bakery & Flour Co."

    return SustainabilitySummaryResponse(
        total_estimated_co2_tonnes=round(total_co2_kg / 1000.0, 2),
        average_carbon_score=avg_score,
        cleanest_supplier=cleanest,
        transport_modes_breakdown=mode_counts,
        suppliers=supplier_items
    )

@router.get("/suppliers", response_model=List[SupplierSustainabilityItem])
def get_supplier_sustainability_breakdown(db: Session = Depends(get_db)):
    """
    Returns granular carbon estimates and transport parameters per supplier.
    """
    suppliers = db.query(SupplierModel).all()
    results: List[SupplierSustainabilityItem] = []

    for sup in suppliers:
        mode = (sup.transport_mode or "ROAD").upper()
        factor = EMISSION_FACTORS.get(mode, 0.105)
        dist = sup.distance_km or 450.0
        co2_est = round(dist * 5.0 * factor, 1)
        carb_score = sup.carbon_score or 85
        rank = sup.sustainability_rank or ("A+" if carb_score >= 90 else "A")

        results.append(SupplierSustainabilityItem(
            supplier_id=sup.id,
            supplier_name=sup.name,
            supplier_tier=sup.supplier_tier or "TIER_1",
            location=sup.location,
            transport_mode=mode,
            distance_km=dist,
            shipment_weight_kg=5000.0,
            carbon_emission_factor=factor,
            estimated_co2_kg=co2_est,
            carbon_score=carb_score,
            sustainability_rank=rank,
            ai_recommendation=f"Recommended for low-carbon procurement lanes via {mode} freight."
        ))

    return results
