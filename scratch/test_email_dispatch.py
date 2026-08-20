import sys
import os

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from backend.main import app
from backend.seed_data import init_db_and_seed

client = TestClient(app)

def test_email_workflow():
    print("=" * 60)
    print("TESTING LOW STOCK EMAIL DISPATCH WORKFLOW")
    print("=" * 60)

    # 1. Seed DB
    init_db_and_seed()

    # 2. Test direct test email endpoint
    print("\n[Step 1] Testing POST /api/inventory/alerts/test-email...")
    test_email = "alexander.vance@supplychain.ai"
    res = client.post(f"/api/inventory/alerts/test-email?target_email={test_email}&target_name=Alexander%20Vance")
    assert res.status_code == 200, f"Failed: {res.text}"
    data = res.json()
    print(f"✓ Test email response: {data}")
    assert data["result"]["recipient"] == test_email
    assert data["result"]["success"] is True

    # 3. Test simulate-stockout with dynamic recipient email
    print("\n[Step 2] Testing POST /api/inventory/simulate-stockout with custom recipient...")
    custom_recipient = "operations.lead@enterprise-logistics.com"
    sim_res = client.post("/api/inventory/simulate-stockout", json={
        "sku": "SKU-AVO-303",
        "simulated_stock": 12,
        "recipient_email": custom_recipient,
        "recipient_name": "Operations Director"
    })
    assert sim_res.status_code == 200, f"Failed: {sim_res.text}"
    sim_data = sim_res.json()
    print(f"✓ Simulate stockout response: SKU={sim_data['simulated_sku']}, Stock={sim_data['current_stock']}")

    # 4. Verify sent emails ledger
    print("\n[Step 3] Verifying GET /api/inventory/alerts/sent-emails...")
    sent_res = client.get("/api/inventory/alerts/sent-emails")
    assert sent_res.status_code == 200, f"Failed: {sent_res.text}"
    sent_emails = sent_res.json()
    print(f"✓ Found {len(sent_emails)} sent emails in the audit ledger:")
    for i, e in enumerate(sent_emails[:3], 1):
        print(f"  {i}. To: {e.get('recipient')} | Subject: {e.get('subject')} | Status: {e.get('status')} | Provider: {e.get('provider')}")

    assert any(e.get("recipient") == custom_recipient for e in sent_emails), "Custom recipient not found in outbox ledger!"
    assert any(e.get("recipient") == test_email for e in sent_emails), "Test email not found in outbox ledger!"

    print("\n" + "=" * 60)
    print("ALL EMAIL DISPATCH TESTS PASSED! (100%)")
    print("=" * 60)

if __name__ == "__main__":
    test_email_workflow()
