import json
from sqlalchemy import text
from backend.database import SessionLocal, engine, Base
from backend.models import UserModel, OrderModel, InventoryModel, SupplierModel, RestockApprovalModel, NotificationModel, PaymentTransactionModel

def init_db_and_seed():
    Base.metadata.create_all(bind=engine)
    
    # Auto-migrate missing columns for SQLite
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR DEFAULT '+1 (555) 382-9014'"))
            conn.commit()
        except Exception:
            pass # column already exists

    db = SessionLocal()

    try:
        # Clear legacy items if present
        try:
            db.query(OrderModel).delete(synchronize_session=False)
            db.query(InventoryModel).delete(synchronize_session=False)
            db.query(SupplierModel).delete(synchronize_session=False)
            db.query(RestockApprovalModel).delete(synchronize_session=False)
            db.query(PaymentTransactionModel).delete(synchronize_session=False)
            db.commit()
        except Exception as e:
            print(f"[Seed Notice]: {e}")


        # 1. Seed User
        if not db.query(UserModel).first():
            user = UserModel(
                email="a.vance@supplychain.ai",
                name="Alexander Vance",
                phone="+1 (555) 382-9014",
                role="VP of Global Grocery Logistics",
                avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            )
            db.add(user)

        # 2. Seed Orders
        orders_data = [
            {
                "id": "ORD-8942",
                "item": "Fresh Organic Whole Milk (1 Gallon)",
                "sku": "SKU-MILK-101",
                "supplier": "GreenField Dairy Farms",
                "origin": "Shenzhen Cold Chain Hub",
                "destination": "Chicago Distribution Hub (ORD-3)",
                "carrier": "ColdExpress Refrigerated Logistics",
                "status": "In Transit",
                "status_color": "tertiary",
                "eta": "Oct 24, 2026",
                "progress": 68,
                "value": "₹34,800",
                "priority": "High",
                "timeline": [
                    {"time": "Oct 12, 08:30", "title": "Farm Dispatch", "desc": "Loaded into temperature-controlled container #DAIRY-9921", "done": True},
                    {"time": "Oct 14, 14:15", "title": "Cold Chain Quality Inspection Passed", "desc": "FDA & USDA compliance passed", "done": True},
                    {"time": "Oct 18, 03:00", "title": "Interstate Refrigerated Transit", "desc": "Refrigerated convoy on schedule", "done": True},
                    {"time": "Oct 22, 11:00", "title": "Regional Distribution Hub Arrival", "desc": "Berthing scheduled at Cold Dock 4", "done": False},
                    {"time": "Oct 24, 18:00", "title": "Supermarket Final Delivery", "desc": "Final mile delivery to Chicago stores", "done": False}
                ]
            },
            {
                "id": "ORD-8941",
                "item": "Whole Wheat Bread Loaves (Pack of 12)",
                "sku": "SKU-BREAD-202",
                "supplier": "Nordic Bakery & Flour Co.",
                "origin": "Oslo Bakery Hub, NO",
                "destination": "Rotterdam Supermarket Terminal",
                "carrier": "DHL Fresh Logistics",
                "status": "Delivered",
                "status_color": "primary",
                "eta": "Oct 19, 2026",
                "progress": 100,
                "value": "₹14,500",
                "priority": "Medium",
                "timeline": [
                    {"time": "Oct 15, 09:00", "title": "Dispatched from Oslo Bakery", "desc": "Fresh batch baked and manifest filed", "done": True},
                    {"time": "Oct 17, 16:00", "title": "Cross-Border Fresh Transit", "desc": "Crossed to Netherlands corridor", "done": True},
                    {"time": "Oct 19, 10:45", "title": "Signed & Delivered at Rotterdam Depot", "desc": "Receiver accepted with 0 fresh defects", "done": True}
                ]
            },
            {
                "id": "ORD-8939",
                "item": "Fresh Hass Avocados (Box of 24)",
                "sku": "SKU-AVO-303",
                "supplier": "Apex Organic Produce",
                "origin": "Hsinchu Farms, TW",
                "destination": "Munich Fresh Facility",
                "carrier": "AirFresh Express Cargo",
                "status": "Customs Hold",
                "status_color": "error",
                "eta": "Oct 21, 2026",
                "progress": 45,
                "value": "₹58,000",
                "priority": "Critical",
                "timeline": [
                    {"time": "Oct 16, 06:00", "title": "Harvested & Air-Shipped", "desc": "Departed Taoyuan Cargo Air", "done": True},
                    {"time": "Oct 17, 22:30", "title": "Frankfurt Airport Agricultural Clearance", "desc": "Held for organic phytosanitary inspection", "done": True},
                    {"time": "Oct 20, Pending", "title": "AI Expedited Clearance Filing", "desc": "Autonomous filing of EU organic certificate", "done": False},
                    {"time": "Oct 21, Scheduled", "title": "Final Temperature Van Delivery", "desc": "Direct delivery to Munich distribution center", "done": False}
                ]
            },
            {
                "id": "ORD-8935",
                "item": "Farm Fresh Organic Eggs (Grade A 12-Pack)",
                "sku": "SKU-EGG-404",
                "supplier": "Katanga Poultry Farms",
                "origin": "Kolwezi Organic Ranch",
                "destination": "Austin Supermarket Distribution",
                "carrier": "Hapag-Lloyd Cold Shipping",
                "status": "In Transit",
                "status_color": "tertiary",
                "eta": "Nov 02, 2026",
                "progress": 35,
                "value": "₹89,000",
                "priority": "High",
                "timeline": [
                    {"time": "Oct 08, 10:00", "title": "Farm Gate Inspection Passed", "desc": "Certified cage-free organic stamp", "done": True},
                    {"time": "Oct 13, 19:20", "title": "Loaded on Cold Vessel Durban", "desc": "Cold storage hold set to 3.5C", "done": True},
                    {"time": "Oct 28, Expected", "title": "Arrival Port of Houston", "desc": "Offloading at Bayport Fresh Terminal", "done": False},
                    {"time": "Nov 02, Expected", "title": "Arrival Austin Distribution", "desc": "Refrigerated truck convoy", "done": False}
                ]
            },
            {
                "id": "ORD-8930",
                "item": "Extra Virgin Olive Oil (1L Bottle)",
                "sku": "SKU-OIL-505",
                "supplier": "Nippon Organics & Foodware",
                "origin": "Yokohama Olive Orchards, JP",
                "destination": "Seattle Grocery Center",
                "carrier": "Nippon Express Air Cargo",
                "status": "In Transit",
                "status_color": "tertiary",
                "eta": "Oct 23, 2026",
                "progress": 82,
                "value": "₹41,200",
                "priority": "Medium",
                "timeline": [
                    {"time": "Oct 17, 11:30", "title": "Bottled & Picked up Yokohama", "desc": "Glass protection packing", "done": True},
                    {"time": "Oct 18, 20:00", "title": "Tokyo Narita Air Freight Departed", "desc": "Flight JL-6002", "done": True},
                    {"time": "Oct 19, 14:00", "title": "Cleared US FDA Customs SEA-TAC", "desc": "Food import clearance approved", "done": True},
                    {"time": "Oct 23, Scheduled", "title": "Final Retail Docking", "desc": "Scheduled delivery window 09:00 - 12:00", "done": False}
                ]
            }
        ]
        for od in orders_data:
            db.add(OrderModel(
                id=od["id"],
                item=od["item"],
                sku=od["sku"],
                supplier=od["supplier"],
                origin=od["origin"],
                destination=od["destination"],
                carrier=od["carrier"],
                status=od["status"],
                status_color=od["status_color"],
                eta=od["eta"],
                progress=od["progress"],
                value=od["value"],
                priority=od["priority"],
                timeline_json=json.dumps(od["timeline"])
            ))

        # 3. Seed Inventory
        inv_data = [
            {"sku": "SKU-MILK-101", "name": "Fresh Organic Whole Milk (1 Gallon)", "category": "Dairy & Refrigerated", "warehouse": "Chicago Cold Hub (ORD-3)", "on_hand": 1420, "min_safety": 1200, "incoming": 500, "unit_cost": "₹4.50", "turnover": "52.4x/yr", "status": "Optimal", "status_color": "tertiary"},
            {"sku": "SKU-AVO-303", "name": "Fresh Hass Avocados (Box of 24)", "category": "Fresh Produce", "warehouse": "Munich Fresh Facility", "on_hand": 180, "min_safety": 350, "incoming": 400, "unit_cost": "₹28.00", "turnover": "48.2x/yr", "status": "Critical Low", "status_color": "error"},
            {"sku": "SKU-EGG-404", "name": "Farm Fresh Organic Eggs (Grade A 12-Pack)", "category": "Dairy & Poultry", "warehouse": "Austin Farm Hub", "on_hand": 4200, "min_safety": 3000, "incoming": 2000, "unit_cost": "₹4.80", "turnover": "60.8x/yr", "status": "Optimal", "status_color": "tertiary"},
            {"sku": "SKU-BREAD-202", "name": "Whole Wheat Bread Loaves (Pack of 12)", "category": "Bakery", "warehouse": "Rotterdam Bakery Depot", "on_hand": 840, "min_safety": 800, "incoming": 1200, "unit_cost": "₹3.20", "turnover": "74.1x/yr", "status": "Warning", "status_color": "primary-container"},
            {"sku": "SKU-OIL-505", "name": "Extra Virgin Olive Oil (1L Bottle)", "category": "Pantry Staples", "warehouse": "Seattle Grocery Center", "on_hand": 310, "min_safety": 250, "incoming": 150, "unit_cost": "₹14.50", "turnover": "18.4x/yr", "status": "Optimal", "status_color": "tertiary"},
            {"sku": "SKU-BAN-606", "name": "Organic Cavendish Bananas (Box of 40)", "category": "Fresh Produce", "warehouse": "Tokyo Fresh Hub", "on_hand": 620, "min_safety": 900, "incoming": 0, "unit_cost": "₹18.00", "turnover": "65.9x/yr", "status": "Warning", "status_color": "primary-container"}
        ]
        for item in inv_data:
            db.add(InventoryModel(**item))

        # 4. Seed Suppliers
        sup_data = [
            {"id": "SUP-01", "name": "GreenField Dairy Farms", "location": "Shenzhen, CN", "category": "Dairy & Produce", "vetted": True, "otif": "99.4%", "defect_rate": "0.012%", "trust_score": 98, "active_contracts": 4, "lead_time_days": 3, "avatar": "factory"},
            {"id": "SUP-02", "name": "Nordic Bakery & Flour Co.", "location": "Oslo, NO", "category": "Bakery & Grains", "vetted": True, "otif": "98.1%", "defect_rate": "0.005%", "trust_score": 96, "active_contracts": 2, "lead_time_days": 2, "avatar": "inventory_2"},
            {"id": "SUP-03", "name": "Apex Organic Produce", "location": "Hsinchu, TW", "category": "Fresh Fruits & Veggies", "vetted": True, "otif": "96.8%", "defect_rate": "0.024%", "trust_score": 94, "active_contracts": 6, "lead_time_days": 4, "avatar": "memory"},
            {"id": "SUP-04", "name": "Katanga Poultry Farms", "location": "Kolwezi, CD", "category": "Poultry & Dairy", "vetted": True, "otif": "94.2%", "defect_rate": "0.040%", "trust_score": 91, "active_contracts": 3, "lead_time_days": 5, "avatar": "shield"},
            {"id": "SUP-05", "name": "Nippon Organics & Foodware", "location": "Yokohama, JP", "category": "Pantry & Oils", "vetted": True, "otif": "99.8%", "defect_rate": "0.001%", "trust_score": 99, "active_contracts": 5, "lead_time_days": 3, "avatar": "precision_manufacturing"}
        ]
        for sup in sup_data:
            db.add(SupplierModel(**sup))

        # 5. Seed Approvals
        apv_data = [
            {
                "id": "APV-401",
                "po_number": "PO-2026-9921",
                "sku": "SKU-AVO-303",
                "item": "Fresh Hass Avocados (Box of 24)",
                "qty": 600,
                "total_cost": "₹16,800",
                "unit_price": "₹28.00",
                "supplier": "Apex Organic Produce",
                "urgency": "Critical",
                "status": "Pending Authorization",
                "reason": "Predicted +48% weekend grocery shopping demand surge across European supermarket chains",
                "financial_impact": "Prevents estimated ₹420,000 spoilage & stockout loss at Munich facility",
                "confidence_score": "99.4%",
                "quotes": [
                    {"vendor": "Apex Organic (Preferred)", "price": "₹28.00/box", "leadTime": "2 Days", "reliability": "99.2%", "selected": True},
                    {"vendor": "GlobalFresh EU", "price": "₹32.00/box", "leadTime": "4 Days", "reliability": "94.0%", "selected": False},
                    {"vendor": "Eastern Produce Co.", "price": "₹26.50/box", "leadTime": "7 Days", "reliability": "89.5%", "selected": False}
                ]
            }
        ]
        for a in apv_data:
            quotes = a.pop("quotes")
            db.add(RestockApprovalModel(**a, quotes_json=json.dumps(quotes)))

        # 6. Seed Payment Transactions
        txns = [
            {
                "id": "pay_TRv8942LiveAlpha",
                "order_id": "ORD-8942",
                "po_number": "PO-8942-RESTOCK",
                "amount": 34800.00,
                "currency": "USD",
                "method": "smart_escrow",
                "vendor": "GreenField Dairy Farms",
                "invoice_ref": "#INV-2026-8942-GF",
                "status": "ESCROW_LOCKED",
                "erp_synced": True
            },
            {
                "id": "ach_FedWire994201",
                "order_id": "ORD-8941",
                "po_number": "PO-8941-NOR",
                "amount": 14500.00,
                "currency": "USD",
                "method": "ach",
                "vendor": "Nordic Bakery & Flour Co.",
                "invoice_ref": "#INV-2026-8941-NOR",
                "status": "SETTLED",
                "erp_synced": True
            },
            {
                "id": "rzp_test_9842XlaI4P",
                "order_id": "ORD-8930",
                "po_number": "PO-8930-NIP",
                "amount": 41200.00,
                "currency": "USD",
                "method": "razorpay",
                "vendor": "Nippon Organics & Foodware",
                "invoice_ref": "#INV-2026-8930-NIP",
                "status": "CAPTURED",
                "erp_synced": True
            }
        ]
        for t in txns:
            db.add(PaymentTransactionModel(**t))

        db.commit()
    finally:
        db.close()
