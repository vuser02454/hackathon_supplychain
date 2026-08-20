import os
import requests
from typing import Optional, Dict, Any

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://jqkgavoculcubjqwgsrae.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

def get_supabase_headers() -> Dict[str, str]:
    key = os.getenv("SUPABASE_KEY", SUPABASE_KEY)
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

def sync_user_to_supabase(user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Upserts user record directly into Supabase 'users' table.
    """
    supabase_url = os.getenv("SUPABASE_URL", SUPABASE_URL)
    supabase_key = os.getenv("SUPABASE_KEY", SUPABASE_KEY)

    if not supabase_url or not supabase_key:
        return None

    try:
        url = f"{supabase_url}/rest/v1/users"
        payload = {
            "email": user_data.get("email"),
            "name": user_data.get("name", "Alexander Vance"),
            "phone": user_data.get("phone", "+91 98765 43210"),
            "role": user_data.get("role", "VP of Global Logistics"),
            "avatar": user_data.get("avatar", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
        }
        
        headers = get_supabase_headers()
        headers["Prefer"] = "resolution=merge-duplicates,return=representation"
        
        res = requests.post(url, headers=headers, json=payload, timeout=5)
        if res.status_code in (200, 201, 204):
            data = res.json() if res.content else payload
            print(f"[Supabase Sync] User successfully synced: {user_data.get('email')}")
            return data[0] if isinstance(data, list) and data else payload
        else:
            print(f"[Supabase Sync Notice] Status {res.status_code}: {res.text}")
    except Exception as e:
        print(f"[Supabase Sync Error]: {e}")
    
    return None

def get_user_from_supabase(email: str) -> Optional[Dict[str, Any]]:
    """
    Fetches user record from Supabase 'users' table by email.
    """
    supabase_url = os.getenv("SUPABASE_URL", SUPABASE_URL)
    supabase_key = os.getenv("SUPABASE_KEY", SUPABASE_KEY)

    if not supabase_url or not supabase_key:
        return None

    try:
        url = f"{supabase_url}/rest/v1/users?email=eq.{email}&select=*"
        res = requests.get(url, headers=get_supabase_headers(), timeout=5)
        if res.status_code == 200 and res.json():
            return res.json()[0]
    except Exception as e:
        print(f"[Supabase Query Error]: {e}")
    
    return None

def sync_inventory_alert_to_supabase(alert_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Upserts an inventory alert into Supabase 'inventory_alerts' table.
    """
    supabase_url = os.getenv("SUPABASE_URL", SUPABASE_URL)
    supabase_key = os.getenv("SUPABASE_KEY", SUPABASE_KEY)

    if not supabase_url or not supabase_key:
        return None

    try:
        url = f"{supabase_url}/rest/v1/inventory_alerts"
        headers = get_supabase_headers()
        headers["Prefer"] = "resolution=merge-duplicates,return=representation"
        
        payload = {
            "id": alert_dict.get("id"),
            "organization_id": alert_dict.get("organization_id", "ORG-DEFAULT"),
            "inventory_id": alert_dict.get("inventory_id") or alert_dict.get("sku"),
            "sku": alert_dict.get("sku"),
            "product_name": alert_dict.get("product_name"),
            "warehouse": alert_dict.get("warehouse"),
            "current_stock": int(alert_dict.get("current_stock", 0)),
            "reorder_point": int(alert_dict.get("reorder_point", 0)),
            "severity": alert_dict.get("severity", "LOW"),
            "message": alert_dict.get("message", ""),
            "is_read": bool(alert_dict.get("is_read", False)),
            "email_sent": bool(alert_dict.get("email_sent", False))
        }

        res = requests.post(url, headers=headers, json=payload, timeout=5)
        if res.status_code in (200, 201, 204):
            print(f"[Supabase Alert Sync] Alert synced: {alert_dict.get('id')}")
            return payload
    except Exception as e:
        print(f"[Supabase Alert Sync Error]: {e}")

    return None

def resolve_alert_in_supabase(alert_id: str) -> bool:
    """
    Marks an alert resolved in Supabase 'inventory_alerts' table.
    """
    supabase_url = os.getenv("SUPABASE_URL", SUPABASE_URL)
    supabase_key = os.getenv("SUPABASE_KEY", SUPABASE_KEY)

    if not supabase_url or not supabase_key:
        return False

    try:
        from datetime import datetime
        url = f"{supabase_url}/rest/v1/inventory_alerts?id=eq.{alert_id}"
        headers = get_supabase_headers()
        payload = {
            "resolved_at": datetime.utcnow().isoformat()
        }
        res = requests.patch(url, headers=headers, json=payload, timeout=5)
        return res.status_code in (200, 204)
    except Exception as e:
        print(f"[Supabase Alert Resolve Error]: {e}")
    return False

