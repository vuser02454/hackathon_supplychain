import os
import requests
import json
from typing import Dict, Any, Optional

def send_low_stock_email(
    user_email: str,
    user_name: str,
    inventory_item: Dict[str, Any],
    alert_data: Dict[str, Any],
    ai_recommendation: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Sends an automated Low Stock / Critical Stock email alert to the responsible user/organization.
    Uses Resend API if configured; otherwise gracefully falls back to logging without crashing.
    """
    email_provider = os.getenv("EMAIL_PROVIDER", "resend").lower()
    resend_api_key = os.getenv("RESEND_API_KEY")
    email_from = os.getenv("EMAIL_FROM", "SupplyChain.AI Alerts <onboarding@resend.dev>")
    
    product_name = inventory_item.get("name", "Item")
    sku = inventory_item.get("sku", alert_data.get("sku", "SKU-UNKNOWN"))
    warehouse = inventory_item.get("warehouse", "Central Hub")
    current_stock = alert_data.get("current_stock", inventory_item.get("on_hand", 0))
    reorder_point = alert_data.get("reorder_point", inventory_item.get("min_safety", 0))
    severity = alert_data.get("severity", "LOW").upper()
    
    recommended_qty = 150
    recommended_supplier = "Apex Organic Produce"
    ai_reason = "High stockout risk. Immediate replenishment recommended to maintain buffer."
    days_left = 1.8
    
    if ai_recommendation:
        recommended_qty = ai_recommendation.get("recommended_quantity", recommended_qty)
        recommended_supplier = ai_recommendation.get("recommended_supplier", recommended_supplier)
        ai_reason = ai_recommendation.get("ai_reasoning", ai_reason)
        days_left = ai_recommendation.get("days_until_stockout", days_left)

    severity_icon = "🚨" if severity == "CRITICAL" else "⚠️"
    subject = f"SupplyChain.AI {severity_icon} {severity.capitalize()} Stock Alert — {product_name}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1622; color: #d4e4fa; margin: 0; padding: 24px; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #122131; border: 1px solid #273647; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
        .header {{ background: linear-gradient(135deg, #1c2b3c 0%, #0d1c2d 100%); padding: 24px; border-bottom: 2px solid {'#ff5c35' if severity == 'CRITICAL' else '#f59e0b'}; }}
        .badge {{ display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold; background-color: {'rgba(255,92,53,0.2)' if severity == 'CRITICAL' else 'rgba(245,158,11,0.2)'}; color: {'#ff5c35' if severity == 'CRITICAL' else '#f59e0b'}; border: 1px solid {'#ff5c35' if severity == 'CRITICAL' else '#f59e0b'}; }}
        .content {{ padding: 24px; }}
        .table-box {{ width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #0d1c2d; border-radius: 10px; overflow: hidden; border: 1px solid #273647; }}
        .table-box td {{ padding: 12px 16px; border-bottom: 1px solid #1c2b3c; font-size: 13px; }}
        .table-box tr:last-child td {{ border-bottom: none; }}
        .label {{ color: #8992a8; font-weight: 500; width: 40%; }}
        .value {{ color: #ffffff; font-weight: 600; text-align: right; }}
        .ai-card {{ background-color: #1c2b3c; border-left: 4px solid #ff5c35; padding: 16px; border-radius: 8px; margin: 20px 0; }}
        .cta-btn {{ display: block; width: 85%; margin: 24px auto 8px; padding: 14px; text-align: center; background: #ff5c35; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 10px; font-size: 14px; box-shadow: 0 4px 15px rgba(255,92,53,0.35); }}
        .footer {{ padding: 16px 24px; background-color: #0d1c2d; text-align: center; font-size: 11px; color: #8992a8; border-top: 1px solid #273647; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="badge">{severity_icon} {severity} STOCK ALERT</div>
          <h2 style="color: #ffffff; margin: 12px 0 4px 0; font-size: 20px;">SupplyChain.AI Inventory Monitor</h2>
          <p style="color: #8992a8; margin: 0; font-size: 12px;">Automated Sourcing & Telemetry System</p>
        </div>
        <div class="content">
          <p style="margin-top: 0;">Hello <strong>{user_name or 'Alexander Vance'}</strong>,</p>
          <p style="color: #bec6e0; line-height: 1.5;">Your autonomous inventory monitor detected a <strong>{severity.lower()}-stock condition</strong> that requires your review.</p>
          
          <table class="table-box">
            <tr>
              <td class="label">Product Name</td>
              <td class="value">{product_name}</td>
            </tr>
            <tr>
              <td class="label">SKU Identifier</td>
              <td class="value" style="font-family: monospace; color: #7bd0ff;">{sku}</td>
            </tr>
            <tr>
              <td class="label">Warehouse Facility</td>
              <td class="value">{warehouse}</td>
            </tr>
            <tr>
              <td class="label">Current Stock Balance</td>
              <td class="value" style="color: {'#ff5c35' if severity == 'CRITICAL' else '#f59e0b'}; font-size: 15px;">{current_stock} Units</td>
            </tr>
            <tr>
              <td class="label">Safety Reorder Point</td>
              <td class="value">{reorder_point} Units</td>
            </tr>
            <tr>
              <td class="label">Estimated Stock Coverage</td>
              <td class="value" style="color: #ffb4ab;">~{days_left:.1f} Days remaining</td>
            </tr>
            <tr>
              <td class="label">Recommended Restock</td>
              <td class="value" style="color: #7bd0ff;">+{recommended_qty} Units ({recommended_supplier})</td>
            </tr>
          </table>

          <div class="ai-card">
            <div style="font-weight: bold; color: #ff5c35; margin-bottom: 6px; font-size: 12px;">🧠 AI Sourcing Intelligence Recommendation</div>
            <div style="color: #d4e4fa; font-size: 12px; line-height: 1.5;">{ai_reason}</div>
          </div>

          <a href="http://localhost:8000/restock-approval?sku={sku}&source=email_alert" class="cta-btn">
            Review Restock Recommendation →
          </a>

          <p style="text-align: center; color: #8992a8; font-size: 11px; margin-top: 14px;">
            🔒 <em>Human-in-the-Loop Safeguard: No purchase order or payment has been initiated automatically.</em>
          </p>
        </div>
        <div class="footer">
          SupplyChain.AI Enterprise Autonomous Platform • Confidential
        </div>
      </div>
    </body>
    </html>
    """

    plain_text = f"""
SupplyChain.AI {severity_icon} {severity} Stock Alert — {product_name}

Hello {user_name or 'Alexander Vance'},

Your inventory monitoring system detected a {severity.lower()}-stock condition.

Product: {product_name}
SKU: {sku}
Warehouse: {warehouse}
Current Stock: {current_stock}
Reorder Point: {reorder_point}
Estimated Coverage: {days_left:.1f} Days

Recommended Restock: {recommended_qty} Units
Recommended Supplier: {recommended_supplier}

AI Recommendation:
{ai_reason}

Review Restock Recommendation:
http://localhost:8000/restock-approval?sku={sku}&source=email_alert

(Note: No purchase has been created or payment initiated automatically. User review is required.)
"""

    # Check if Resend or external email provider is configured
    if not resend_api_key:
        print(f"[Email Service] Notice: Email provider not configured — alert stored but email not sent to {user_email}.")
        return {
            "success": False,
            "status": "unconfigured",
            "message": "Email provider not configured — alert stored but email not sent.",
            "subject": subject,
            "recipient": user_email
        }

    try:
        url = "https://api.resend.com/emails"
        headers = {
            "Authorization": f"Bearer {resend_api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "from": email_from,
            "to": [user_email],
            "subject": subject,
            "html": html_content,
            "text": plain_text
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=8)
        if response.status_code in (200, 201):
            data = response.json()
            print(f"[Email Service] Email successfully dispatched to {user_email} (ID: {data.get('id')})")
            return {
                "success": True,
                "status": "sent",
                "message_id": data.get("id"),
                "subject": subject,
                "recipient": user_email
            }
        else:
            print(f"[Email Service Error] Status {response.status_code}: {response.text}")
            return {
                "success": False,
                "status": "error",
                "message": f"Resend API error: {response.text}",
                "subject": subject,
                "recipient": user_email
            }
    except Exception as e:
        print(f"[Email Service Exception]: {e}")
        return {
            "success": False,
            "status": "exception",
            "message": str(e),
            "subject": subject,
            "recipient": user_email
        }
