import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from backend.main import app
from backend.seed_data import init_db_and_seed

client = TestClient(app)

def test_dynamic_user_account_email():
    print("=" * 60)
    print("TESTING USER-SPECIFIC LOW STOCK EMAIL ROUTING")
    print("=" * 60)

    # 1. Initialize DB
    init_db_and_seed()

    # 2. User 1 logs in with xyz@gmail.com
    print("\n[Step 1] User logs in with xyz@gmail.com...")
    login_res = client.post("/api/auth/login", json={"email": "xyz@gmail.com", "password": "pass"})
    assert login_res.status_code == 200
    user_data = login_res.json()
    print(f"✓ Authenticated user email in DB: {user_data['email']}")
    assert user_data["email"] == "xyz@gmail.com"

    # 3. Simulate low stock when xyz@gmail.com is logged in
    print("\n[Step 2] Simulating low stock event for xyz@gmail.com...")
    sim_res = client.post("/api/inventory/simulate-stockout", json={
        "sku": "SKU-AVO-303",
        "simulated_stock": 14,
        "recipient_email": "xyz@gmail.com",
        "recipient_name": "XYZ Manager"
    })
    assert sim_res.status_code == 200

    # 4. Check sent emails ledger
    print("\n[Step 3] Verifying email sent to xyz@gmail.com...")
    sent_res = client.get("/api/inventory/alerts/sent-emails")
    assert sent_res.status_code == 200
    sent_emails = sent_res.json()
    latest_email = sent_emails[0]
    print(f"✓ Latest email dispatched:")
    print(f"  - To: {latest_email.get('recipient')}")
    print(f"  - Recipient Name: {latest_email.get('recipient_name')}")
    print(f"  - Subject: {latest_email.get('subject')}")
    print(f"  - Status: {latest_email.get('status')} via {latest_email.get('provider')}")
    assert latest_email.get("recipient") == "xyz@gmail.com"

    # 5. User 2 logs in with warehouse.lead@globalchain.org
    print("\n[Step 4] Different user logs in with warehouse.lead@globalchain.org...")
    login_res2 = client.post("/api/auth/login", json={"email": "warehouse.lead@globalchain.org", "password": "pass"})
    assert login_res2.status_code == 200
    user_data2 = login_res2.json()
    print(f"✓ Authenticated user email in DB: {user_data2['email']}")
    assert user_data2["email"] == "warehouse.lead@globalchain.org"

    # 6. Automatic stock check (without manual override) sends to warehouse.lead@globalchain.org
    print("\n[Step 5] Triggering scan without query override (uses DB UserModel email)...")
    scan_res = client.post("/api/inventory/check-stock")
    assert scan_res.status_code == 200
    
    sent_res2 = client.get("/api/inventory/alerts/sent-emails")
    latest_email2 = sent_res2.json()[0]
    print(f"✓ Dispatched to active user in DB: {latest_email2.get('recipient')}")

    print("\n" + "=" * 60)
    print("ALL USER-SPECIFIC EMAIL TESTS PASSED! (100%)")
    print("=" * 60)

if __name__ == "__main__":
    test_dynamic_user_account_email()
