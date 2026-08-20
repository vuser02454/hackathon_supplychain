from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime
from datetime import datetime
from backend.database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(String, default="ORG-DEFAULT", index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, default="+1 (555) 382-9014")
    role = Column(String, default="VP of Global Logistics")
    avatar = Column(String, default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
    created_at = Column(DateTime, default=datetime.utcnow)

class OrderModel(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True) # e.g. ORD-8942
    organization_id = Column(String, default="ORG-DEFAULT", index=True)
    po_number = Column(String, nullable=True, index=True) # e.g. PO-2026-8942
    item = Column(String, nullable=False)
    sku = Column(String, nullable=False, index=True)
    supplier = Column(String, nullable=False)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    carrier = Column(String, nullable=False)
    status = Column(String, default="SHIPMENT_CREATED") # SHIPMENT_CREATED, IN_TRANSIT, DELIVERED, Customs Hold
    status_color = Column(String, default="tertiary")
    eta = Column(String, nullable=False)
    progress = Column(Integer, default=0)
    value = Column(String, nullable=False)
    priority = Column(String, default="High")
    timeline_json = Column(Text, nullable=True) # JSON serialized timeline
    delivered_quantity = Column(Integer, default=0)
    defective_quantity = Column(Integer, default=0)
    actual_days = Column(Integer, default=0)
    is_simulated_telemetry = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class InventoryModel(Base):
    __tablename__ = "inventory"

    sku = Column(String, primary_key=True, index=True) # e.g. SKU-BAT-884
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    warehouse = Column(String, nullable=False)
    on_hand = Column(Integer, default=0)
    min_safety = Column(Integer, default=0)
    incoming = Column(Integer, default=0)
    unit_cost = Column(String, default="₹100.00")
    turnover = Column(String, default="10.0x/yr")
    status = Column(String, default="Optimal")
    status_color = Column(String, default="tertiary")
    is_perishable = Column(Boolean, default=False)
    shelf_life_days = Column(Integer, default=30)
    expiry_date = Column(String, default="2026-11-30")
    waste_risk = Column(String, default="NORMAL") # NORMAL, WASTE_RISK, EXPIRING_SOON, CRITICAL
    primary_supplier_id = Column(String, default="SUP-01")
    supplier_dependency_pct = Column(Integer, default=65) # Single point of failure if >70%
    alternative_suppliers_count = Column(Integer, default=3)
    authenticity_risk_score = Column(Integer, default=8) # 0-100 (lower is safer)
    batch_id = Column(String, default="BATCH-2026-001")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SupplierModel(Base):
    __tablename__ = "suppliers"

    id = Column(String, primary_key=True, index=True) # e.g. SUP-01
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    category = Column(String, nullable=False)
    vetted = Column(Boolean, default=True)
    otif = Column(String, default="99.0%")
    defect_rate = Column(String, default="0.010%")
    trust_score = Column(Integer, default=95)
    active_contracts = Column(Integer, default=1)
    lead_time_days = Column(Integer, default=14)
    avatar = Column(String, default="factory")
    supplier_tier = Column(String, default="TIER_1") # TIER_1, TIER_2, TIER_3
    supplier_size = Column(String, default="MID_MARKET") # ENTERPRISE, MID_MARKET, SMALL / SME
    sme_opportunity_score = Column(Integer, default=80) # 0-100
    transport_mode = Column(String, default="ROAD") # AIR, OCEAN, RAIL, ROAD
    distance_km = Column(Float, default=450.0)
    carbon_emission_factor = Column(Float, default=0.105) # kg CO2 / ton-km
    carbon_score = Column(Integer, default=85) # 0-100
    estimated_co2_kg = Column(Float, default=420.0)
    sustainability_rank = Column(String, default="A") # A+, A, B, C
    authenticity_verified = Column(Boolean, default=True)
    parent_supplier_id = Column(String, nullable=True) # For Tier 2/3 linkage

class ProductTraceabilityModel(Base):
    __tablename__ = "product_traceability"

    id = Column(String, primary_key=True, index=True) # e.g. TRC-2026-001
    organization_id = Column(String, default="ORG-DEFAULT", index=True)
    batch_id = Column(String, nullable=False, index=True)
    sku = Column(String, nullable=False, index=True)
    product_name = Column(String, nullable=False)
    supplier_id = Column(String, nullable=False, index=True)
    supplier_name = Column(String, nullable=False)
    purchase_order_id = Column(String, nullable=True)
    shipment_id = Column(String, nullable=True)
    authentication_status = Column(String, default="VERIFIED") # VERIFIED, PENDING, FLAGGED
    authenticity_risk_score = Column(Integer, default=8) # 0-100
    chain_of_custody_json = Column(Text, nullable=True) # JSON custody checkpoints
    created_at = Column(DateTime, default=datetime.utcnow)

class RestockApprovalModel(Base):
    __tablename__ = "approvals"

    id = Column(String, primary_key=True, index=True) # e.g. APV-401
    organization_id = Column(String, default="ORG-DEFAULT", index=True)
    po_number = Column(String, nullable=False, index=True)
    sku = Column(String, nullable=False, index=True)
    item = Column(String, nullable=False)
    qty = Column(Integer, default=500)
    total_cost = Column(String, nullable=False)
    unit_price = Column(String, nullable=False)
    supplier = Column(String, nullable=False)
    urgency = Column(String, default="High")
    status = Column(String, default="Pending Authorization") # Pending Authorization, Approved, APPROVED / PAYMENT_PENDING, PAID, FULFILLED
    reason = Column(Text, nullable=True)
    financial_impact = Column(String, nullable=True)
    confidence_score = Column(String, default="99.0%")
    quotes_json = Column(Text, nullable=True) # JSON serialized quotes
    ai_explainability_json = Column(Text, nullable=True) # JSON serialized factor weights
    payment_id = Column(String, nullable=True)
    shipment_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class NotificationModel(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, default="ORG-DEFAULT", index=True)
    title = Column(String, nullable=False)
    time_label = Column(String, default="Just now")
    is_read = Column(Boolean, default=False)
    notif_type = Column(String, default="ai") # ai, transit, alert, supplier
    created_at = Column(DateTime, default=datetime.utcnow)

class PaymentTransactionModel(Base):
    __tablename__ = "payment_transactions"

    id = Column(String, primary_key=True, index=True) # e.g. pay_9842...
    organization_id = Column(String, default="ORG-DEFAULT", index=True)
    order_id = Column(String, nullable=True, index=True) # e.g. ORD-8942
    po_number = Column(String, nullable=True, index=True) # e.g. PO-8942-RESTOCK
    amount = Column(Float, nullable=False) # e.g. 66880.00
    currency = Column(String, default="INR")
    method = Column(String, default="razorpay") # razorpay, ach, escrow
    vendor = Column(String, default="Apex Precision Machining Ltd.")
    invoice_ref = Column(String, default="#INV-2026-8942-AP")
    status = Column(String, default="CAPTURED") # CAPTURED, SETTLED, ESCROW_LOCKED
    erp_synced = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class InventoryAlertModel(Base):
    __tablename__ = "inventory_alerts"

    id = Column(String, primary_key=True, index=True) # e.g. ALT-2026-1042
    organization_id = Column(String, default="ORG-DEFAULT", index=True)
    inventory_id = Column(String, nullable=True, index=True)
    sku = Column(String, nullable=False, index=True)
    product_name = Column(String, nullable=False)
    warehouse = Column(String, nullable=False)
    current_stock = Column(Integer, nullable=False)
    safety_stock = Column(Integer, default=0)
    reorder_point = Column(Integer, nullable=False)
    severity = Column(String, default="LOW") # LOW, CRITICAL
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    email_sent = Column(Boolean, default=False)
    ai_recommendation_json = Column(Text, nullable=True) # JSON with days_left, qty, supplier, etc.
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

class SupplierPerformanceHistoryModel(Base):
    __tablename__ = "supplier_performance_history"

    id = Column(String, primary_key=True, index=True) # e.g. SPH-2026-001
    organization_id = Column(String, default="ORG-DEFAULT", index=True)
    supplier_id = Column(String, nullable=False, index=True)
    supplier_name = Column(String, nullable=False)
    order_id = Column(String, nullable=True, index=True)
    po_number = Column(String, nullable=True, index=True)
    sku = Column(String, nullable=False)
    delivered_quantity = Column(Integer, default=0)
    defective_quantity = Column(Integer, default=0)
    expected_lead_time_days = Column(Integer, default=3)
    actual_lead_time_days = Column(Integer, default=3)
    outcome_status = Column(String, default="DELIVERED_ON_TIME") # DELIVERED_EARLY, DELIVERED_ON_TIME, DELIVERED_LATE
    previous_trust_score = Column(Integer, default=85)
    updated_trust_score = Column(Integer, default=90)
    previous_otif = Column(String, default="95.0%")
    updated_otif = Column(String, default="96.5%")
    previous_defect_rate = Column(String, default="1.5%")
    updated_defect_rate = Column(String, default="1.2%")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


