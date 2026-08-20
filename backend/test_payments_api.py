import os
import sys
import hmac
import hashlib

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from backend.main import app
from backend.seed_data import init_db_and_seed

def run_tests():
    init_db_and_seed()
    with TestClient(app) as client:
        print("=== STARTING PAYMENT GATEWAY BACKEND VERIFICATION ===")

        # 1. Health Check
        res = client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("[OK] GET /api/health:", res.json())

        # 2. Get Payment Config
        res = client.get("/api/payments/config")
        assert res.status_code == 200, f"Get config failed: {res.text}"
        config_data = res.json()
        assert config_data["gateway"] == "Razorpay Enterprise B2B Engine"
        print("[OK] GET /api/payments/config:", config_data)

        # 3. Get Payment Summary
        res = client.get("/api/payments/summary")
        assert res.status_code == 200, f"Get summary failed: {res.text}"
        summary_data = res.json()
        print("[OK] GET /api/payments/summary:", summary_data)

        # 4. List Payment Transactions
        res = client.get("/api/payments/transactions")
        assert res.status_code == 200, f"List transactions failed: {res.text}"
        txns = res.json()
        assert len(txns) >= 1, "Expected at least 1 seeded transaction"
        print(f"[OK] GET /api/payments/transactions: {len(txns)} transactions retrieved.")

        # 5. Create Razorpay Order
        res = client.post("/api/payments/create-order", json={
            "amount": 6688000,
            "currency": "INR",
            "receipt": "rcpt_test_101",
            "notes": {"po": "PO-8942-RESTOCK"}
        })
        assert res.status_code == 200, f"Create order failed: {res.text}"
        order_data = res.json()
        assert "id" in order_data
        print("[OK] POST /api/payments/create-order:", order_data)

        # 6. Verify Razorpay Payment Signature
        pay_id = "pay_test_signature_ok_982"
        res = client.post("/api/payments/verify", json={
            "razorpay_order_id": order_data["id"],
            "razorpay_payment_id": pay_id,
            "razorpay_signature": "mock_sig",
            "order_id": "ORD-8942",
            "po_number": "PO-8942-RESTOCK",
            "vendor": "GreenField Dairy Farms",
            "invoice_ref": "#INV-2026-8942-GF",
            "amount": 3480000
        })

        assert res.status_code == 200, f"Verify failed: {res.text}"
        verify_data = res.json()
        assert verify_data["success"] is True
        print("[OK] POST /api/payments/verify:", verify_data)

        # 7. Escrow Lock
        res = client.post("/api/payments/escrow/lock", json={
            "amount": 3480000,
            "currency": "USD",
            "order_id": "ORD-8942",
            "po_number": "PO-8942-RESTOCK",
            "vendor": "GreenField Dairy Farms",
            "invoice_ref": "#INV-2026-8942-GF",
            "release_condition": "Cold-Chain IoT Temperature & Dock Verification"
        })

        assert res.status_code == 200, f"Escrow lock failed: {res.text}"
        escrow_data = res.json()
        assert escrow_data["status"] == "ESCROW_LOCKED"
        print("[OK] POST /api/payments/escrow/lock:", escrow_data)

        # 8. Escrow Release
        res = client.post("/api/payments/escrow/release", json={
            "escrow_id": escrow_data["id"],
            "verification_type": "GEOFENCE_GPS_MATCH"
        })
        assert res.status_code == 200, f"Escrow release failed: {res.text}"
        release_data = res.json()
        assert release_data["status"] == "ESCROW_RELEASED"
        print("[OK] POST /api/payments/escrow/release:", release_data)

        # 9. ACH Authorize
        res = client.post("/api/payments/ach/authorize", json={
            "amount": 6450000,
            "account_name": "Alexander Vance",
            "bank_routing": "021000021",
            "account_number_last4": "9842",
            "order_id": "ORD-8941",
            "po_number": "PO-8941-NOR",
            "vendor": "Nordic Packaging Solutions",
            "invoice_ref": "#INV-2026-8941-NOR"
        })
        assert res.status_code == 200, f"ACH authorize failed: {res.text}"
        ach_data = res.json()
        assert ach_data["status"] == "SETTLED"
        print("[OK] POST /api/payments/ach/authorize:", ach_data)

        # 10. Refund Payment
        res = client.post("/api/payments/refund", json={
            "payment_id": escrow_data["id"],
            "reason": "Defect Verification Refund"
        })
        assert res.status_code == 200, f"Refund failed: {res.text}"
        refund_data = res.json()
        assert refund_data["status"] == "REFUNDED"
        print("[OK] POST /api/payments/refund:", refund_data)

        # 11. Invoice Details
        res = client.get("/api/payments/invoices/INV-2026-8942-AP")
        assert res.status_code == 200, f"Invoice details failed: {res.text}"
        invoice_data = res.json()
        assert invoice_data["invoice_ref"] == "#INV-2026-8942-AP"
        print("[OK] GET /api/payments/invoices/INV-2026-8942-AP:", invoice_data["total"])


        print("\nALL PAYMENT GATEWAY BACKEND VERIFICATION TESTS PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    run_tests()
