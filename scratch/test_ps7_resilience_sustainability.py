"""
End-to-End Verification Test Suite for Problem Statement 7
Resilience & Sustainability in Global Supply Chains
"""

import sys
import os
sys.path.insert(0, os.path.abspath("."))
import json
from fastapi.testclient import TestClient
from main import app
from backend.database import SessionLocal
from backend.seed_data import init_db_and_seed
from backend.models import (
    SupplierModel,
    InventoryModel,
    ProductTraceabilityModel
)

client = TestClient(app)

def run_tests():
    print("=" * 60)
    print("STARTING PS7 RESILIENCE & SUSTAINABILITY TEST SUITE")
    print("=" * 60)

    # 1. Initialize DB and Seed Data
    print("\n[Step 1] Initializing and seeding PS7 database schema...")
    init_db_and_seed()
    print("✓ DB seeded successfully with Tier 1/2/3 suppliers, perishables, and traceability records.")

    # 2. Test Resilience Score API
    print("\n[Step 2] Testing GET /api/resilience/score...")
    res = client.get("/api/resilience/score")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    r_data = res.json()
    print(f"✓ Resilience Score: {r_data['resilience_score']}/100")
    print(f"✓ SPoF Concentration Risk: {r_data['single_point_of_failure_risk']}")
    print(f"✓ Critical SPoF Dependencies Count: {r_data['critical_supplier_dependencies_count']}")
    print(f"✓ AI Recommendation: {r_data['ai_resilience_recommendation']}")
    assert r_data['resilience_score'] > 50, "Resilience score should be positive"
    assert "critical_supplier_dependencies_count" in r_data

    # 3. Test Supplier Dependencies API
    print("\n[Step 3] Testing GET /api/resilience/dependencies...")
    res = client.get("/api/resilience/dependencies")
    assert res.status_code == 200
    dep_data = res.json()
    print(f"✓ Retrieved {len(dep_data['dependencies'])} supplier dependencies.")
    for d in dep_data['dependencies']:
        if d['is_single_point_of_failure']:
            print(f"  - SPoF Detected: {d['sku']} ({d['supplier_dependency_pct']}% concentration on {d['primary_supplier_name']})")

    # 4. Test Sustainability Summary API
    print("\n[Step 4] Testing GET /api/sustainability/summary...")
    res = client.get("/api/sustainability/summary")
    assert res.status_code == 200
    s_data = res.json()
    print(f"✓ Total Estimated CO2: {s_data['total_estimated_co2_tonnes']} tonnes CO2e")
    print(f"✓ Average Carbon Score: {s_data['average_carbon_score']}/100")
    print(f"✓ Cleanest Supplier: {s_data['cleanest_supplier']}")
    print(f"✓ Transport Mode Breakdown: {s_data['transport_modes_breakdown']}")
    assert s_data['total_estimated_co2_tonnes'] > 0
    assert s_data['average_carbon_score'] > 0

    # 5. Test Sustainability Suppliers API
    print("\n[Step 5] Testing GET /api/sustainability/suppliers...")
    res = client.get("/api/sustainability/suppliers")
    assert res.status_code == 200
    suppliers_sust = res.json()
    print(f"✓ Retrieved {len(suppliers_sust)} supplier sustainability scorecards.")
    for sup in suppliers_sust:
        print(f"  - {sup['supplier_name']} ({sup['supplier_tier']}): Mode={sup['transport_mode']}, Rank={sup['sustainability_rank']}, CO2={sup['estimated_co2_kg']} kg")

    # 6. Test Tier Visibility API
    print("\n[Step 6] Testing GET /api/suppliers/tier-visibility...")
    res = client.get("/api/suppliers/tier-visibility")
    assert res.status_code == 200
    tier_data = res.json()
    print(f"✓ Tier Breakdown: Tier 1={tier_data['tier_1_count']}, Tier 2={tier_data['tier_2_count']}, Tier 3={tier_data['tier_3_count']}")
    print(f"✓ Deep Visibility Rate: {tier_data['tier_2_plus_visibility_pct']}%")
    assert tier_data['tier_2_plus_visibility_pct'] > 0

    # 7. Test SME Opportunities API
    print("\n[Step 7] Testing GET /api/suppliers/sme-opportunities...")
    res = client.get("/api/suppliers/sme-opportunities")
    assert res.status_code == 200
    sme_data = res.json()
    print(f"✓ Identified {len(sme_data['opportunities'])} SME suppliers for fair procurement pipeline.")
    for sme in sme_data['opportunities']:
        print(f"  - SME: {sme['supplier_name']} (SME Score: {sme['sme_opportunity_score']}/100, OTIF: {sme['otif']})")

    # 8. Test Perishable Waste Risk API
    print("\n[Step 8] Testing GET /api/inventory/waste-risk...")
    res = client.get("/api/inventory/waste-risk")
    assert res.status_code == 200
    waste_data = res.json()
    print(f"✓ Total Perishable SKUs: {waste_data['total_perishables']}")
    print(f"✓ Expiring Soon Count: {waste_data['expiring_soon_count']}")
    for item in waste_data['items']:
        print(f"  - Perishable: {item['sku']} ({item['product_name']}) -> Expiry: {item['expiry_date']} ({item['days_until_expiry']}d left), Risk: {item['waste_risk_status']}")

    # 9. Test Product Traceability API
    print("\n[Step 9] Testing GET /api/traceability/SKU-AVO-303...")
    res = client.get("/api/traceability/SKU-AVO-303")
    assert res.status_code == 200
    trc_data = res.json()
    print(f"✓ Product Traceability: {trc_data['sku']} -> Batch: {trc_data['batch_id']}, Status: {trc_data['authentication_status']}")
    print(f"✓ Authenticity Risk Score: {trc_data['authenticity_risk_score']}/100")
    print(f"✓ Custody Checkpoints: {len(trc_data['chain_of_custody'])} steps verified.")
    assert trc_data['authentication_status'] == "VERIFIED"
    assert len(trc_data['traceability_checks']) == 5

    # 10. Test AI Sourcing 8-Factor Decision Matrix
    print("\n[Step 10] Testing POST /api/inventory/SKU-AVO-303/restock-recommendation (8-Factor Matrix)...")
    res = client.post("/api/inventory/SKU-AVO-303/restock-recommendation")
    assert res.status_code == 200
    rec = res.json()
    print(f"✓ Recommended Supplier: {rec['recommended_supplier']}")
    print(f"✓ Recommended Qty: {rec['recommended_quantity']}")
    print(f"✓ SPoF Detected: {rec['is_single_point_of_failure']}")
    print(f"✓ Explainability Factors:")
    exp = rec['explainability']
    print(f"  - Cost Advantage: +{exp['cost_advantage_pts']} pts")
    print(f"  - Delivery Speed: +{exp['delivery_speed_pts']} pts")
    print(f"  - OTIF Reliability: +{exp['otif_reliability_pts']} pts")
    print(f"  - Defect History: +{exp['defect_history_pts']} pts")
    print(f"  - Stockout Avoidance: +{exp['stockout_avoidance_pts']} pts")
    print(f"  - Carbon Advantage: +{exp['carbon_advantage_pts']} pts")
    print(f"  - Diversification: +{exp['diversification_pts']} pts")
    print(f"  - Authenticity: +{exp['authenticity_pts']} pts")
    print(f"  - Final Composite Score: {exp['final_score']}/100")
    assert exp['final_score'] > 0
    assert len(rec['supplier_matrix']) > 0

    print("\n" + "=" * 60)
    print("ALL 10 VERIFICATION TESTS PASSED SUCCESSFULLY! (100%)")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
