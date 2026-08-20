from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: str
    name: str
    phone: Optional[str] = "+1 (555) 382-9014"
    role: Optional[str] = "VP of Global Logistics"
    avatar: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: str
    password: Optional[str] = None
    auth_type: Optional[str] = "password" # password, sso, passkey

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    avatar: Optional[str] = None

class UserResponse(UserBase):
    id: int
    authenticated: bool = True
    class Config:
        from_attributes = True

# Order Schemas
class TimelineStep(BaseModel):
    time: str
    title: str
    desc: str
    done: bool

class OrderCreate(BaseModel):
    item: str
    sku: str
    supplier: str
    origin: Optional[str] = "Shenzhen, CN"
    destination: Optional[str] = "Chicago Hub (ORD-3)"
    carrier: Optional[str] = "DHL Global Express"
    eta: Optional[str] = "Oct 29, 2026"
    value: Optional[str] = "$120,000"
    priority: Optional[str] = "High"

class OrderResponse(BaseModel):
    id: str
    item: str
    sku: str
    supplier: str
    origin: str
    destination: str
    carrier: str
    status: str
    status_color: str
    eta: str
    progress: int
    value: str
    priority: str
    timeline: Optional[List[TimelineStep]] = []
    class Config:
        from_attributes = True

# Inventory Schemas
class InventoryItemBase(BaseModel):
    sku: str
    name: str
    category: str
    warehouse: str
    on_hand: int
    min_safety: int
    incoming: int
    unit_cost: str
    turnover: str
    status: str
    status_color: str

class InventoryItemResponse(InventoryItemBase):
    class Config:
        from_attributes = True

# Supplier Schemas
class SupplierResponse(BaseModel):
    id: str
    name: str
    location: str
    category: str
    vetted: bool
    otif: str
    defect_rate: str
    trust_score: int
    active_contracts: int
    lead_time_days: int
    avatar: str
    class Config:
        from_attributes = True

# Restock Approval Schemas
class VendorQuote(BaseModel):
    vendor: str
    price: str
    leadTime: str
    reliability: str
    selected: bool

class RestockApprovalCreate(BaseModel):
    po_number: str
    sku: str
    item: str
    qty: int = 500
    total_cost: str
    unit_price: str
    supplier: str
    urgency: str = "Critical"
    status: Optional[str] = "APPROVED / PAYMENT_PENDING"
    reason: Optional[str] = None
    financial_impact: Optional[str] = None
    confidence_score: Optional[str] = "91.0%"
    quotes: Optional[List[VendorQuote]] = []

class RestockApprovalResponse(BaseModel):
    id: str
    po_number: str
    sku: str
    item: str
    qty: int
    total_cost: str
    unit_price: str
    supplier: str
    urgency: str
    status: str
    reason: Optional[str] = None
    financial_impact: Optional[str] = None
    confidence_score: str
    quotes: Optional[List[VendorQuote]] = []
    class Config:
        from_attributes = True

# Notification Schemas
class NotificationResponse(BaseModel):
    id: str
    title: str
    time: str
    read: bool
    type: str

# Copilot / AI Simulation Schemas
class CopilotQueryRequest(BaseModel):
    prompt: str
    context: Optional[dict] = None

class CopilotQueryResponse(BaseModel):
    response: str
    confidence: float = 0.99
    suggested_actions: Optional[List[str]] = []

# Payment & Settlement Schemas
class PaymentCaptureRequest(BaseModel):
    payment_id: str
    amount: int = 6688000 # In subunits (paise or cents)
    currency: str = "INR"
    order_id: Optional[str] = "ORD-8942"
    po_number: Optional[str] = "PO-8942-RESTOCK"
    vendor: Optional[str] = "Apex Precision Machining Ltd."
    invoice_ref: Optional[str] = "#INV-2026-8942-AP"
    method: Optional[str] = "razorpay"

class PaymentCaptureResponse(BaseModel):
    id: str
    status: str
    amount: float
    currency: str
    vendor: str
    invoice_ref: str
    erp_synced: bool
    timestamp: str

class RazorpayOrderRequest(BaseModel):
    amount: int = 6688000
    currency: str = "INR"
    receipt: Optional[str] = None
    notes: Optional[dict] = None

class RazorpayOrderResponse(BaseModel):
    id: str
    entity: str = "order"
    amount: int
    currency: str
    receipt: Optional[str] = None
    status: str = "created"
    key_id: str

class RazorpayVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: Optional[str] = None
    order_id: Optional[str] = "ORD-8942"
    po_number: Optional[str] = "PO-8942-RESTOCK"
    vendor: Optional[str] = "Apex Precision Machining Ltd."
    invoice_ref: Optional[str] = "#INV-2026-8942-AP"
    amount: Optional[int] = 6688000

class PaymentVerifyResponse(BaseModel):
    success: bool
    payment_id: str
    order_id: Optional[str] = None
    status: str
    message: str

class EscrowLockRequest(BaseModel):
    amount: int = 6688000
    currency: str = "INR"
    order_id: Optional[str] = "ORD-8942"
    po_number: Optional[str] = "PO-8942-RESTOCK"
    vendor: Optional[str] = "Apex Precision Machining Ltd."
    invoice_ref: Optional[str] = "#INV-2026-8942-AP"
    release_condition: Optional[str] = "IoT Dock Barcode + GPS Geofence Verification"

class EscrowReleaseRequest(BaseModel):
    escrow_id: str
    verification_type: Optional[str] = "GEOFENCE_GPS_MATCH"

class ACHAuthorizeRequest(BaseModel):
    amount: int = 6688000
    account_name: Optional[str] = "Alexander Vance"
    bank_routing: Optional[str] = "021000021"
    account_number_last4: Optional[str] = "9842"
    order_id: Optional[str] = "ORD-8942"
    po_number: Optional[str] = "PO-8942-RESTOCK"
    vendor: Optional[str] = "Apex Precision Machining Ltd."
    invoice_ref: Optional[str] = "#INV-2026-8942-AP"

class PaymentRefundRequest(BaseModel):
    payment_id: str
    amount: Optional[float] = None
    reason: Optional[str] = "Order Cancellation / Delivery Defect"

class PaymentRefundResponse(BaseModel):
    refund_id: str
    payment_id: str
    amount: float
    status: str = "REFUNDED"
    message: str

class PaymentTransactionResponse(BaseModel):
    id: str
    order_id: Optional[str] = None
    po_number: Optional[str] = None
    amount: float
    currency: str
    method: str
    vendor: str
    invoice_ref: str
    status: str
    erp_synced: bool
    created_at: datetime
    class Config:
        from_attributes = True

class PaymentConfigResponse(BaseModel):
    gateway: str
    key_id: str
    currency: str
    supported_methods: List[str]
    escrow_smart_contract: str
    status: str

class PaymentSummaryResponse(BaseModel):
    total_settled_usd: float
    escrow_locked_usd: float
    pending_invoices_count: int
    avg_settlement_hours: float
    transaction_count: int

class InvoiceItem(BaseModel):
    description: str
    code: str
    quantity: str
    unit_price: str
    amount: str

class InvoiceResponse(BaseModel):
    invoice_ref: str
    date: str
    po_ref: str
    vendor_name: str
    vendor_address: str
    vendor_tax_id: str
    client_name: str
    client_address: str
    client_email: str
    items: List[InvoiceItem]
    subtotal: str
    discount: str
    total: str
    escrow_verified: bool

# Inventory Alert & Stockout Schemas
class InventoryAlertResponse(BaseModel):
    id: str
    organization_id: str
    inventory_id: Optional[str] = None
    sku: str
    product_name: str
    warehouse: str
    current_stock: int
    safety_stock: int
    reorder_point: int
    severity: str # LOW, CRITICAL
    message: str
    is_read: bool
    email_sent: bool
    ai_recommendation: Optional[dict] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class StockCheckResponse(BaseModel):
    status: str
    total_scanned: int
    normal_count: int
    low_count: int
    critical_count: int
    alerts_created: int
    alerts_resolved: int
    alerts: List[InventoryAlertResponse]

class SimulateStockoutRequest(BaseModel):
    sku: str
    simulated_stock: Optional[int] = 18

class SupplierMatrixItem(BaseModel):
    supplier_id: str
    supplier_name: str
    supplier_tier: str = "TIER_1"
    supplier_size: str = "MID_MARKET"
    unit_price: str
    lead_time_days: int
    otif: str
    defect_rate: str
    trust_score: int
    carbon_score: int = 85
    sustainability_rank: str = "A"
    estimated_co2_kg: float = 420.0
    composite_score: float
    is_recommended: bool
    rank: int
    rationale: str

class AIExplainabilityFactors(BaseModel):
    cost_advantage_pts: int = 18
    delivery_speed_pts: int = 21
    otif_reliability_pts: int = 22
    defect_history_pts: int = 17
    stockout_avoidance_pts: int = 20
    carbon_advantage_pts: int = 8
    diversification_pts: int = 7
    authenticity_pts: int = 5
    final_score: int = 91
    confidence_pct: int = 91
    why_recommended: List[str]
    expected_impact: dict

class RestockRecommendationResponse(BaseModel):
    sku: str
    product_name: str
    warehouse: str
    current_stock: int
    safety_stock: int
    reorder_point: int
    severity: str
    stockout_risk: str
    stockout_risk_before: str = "82%"
    stockout_risk_after: str = "14%"
    days_until_stockout: float
    average_daily_demand: float
    recommended_quantity: int
    recommended_supplier: str
    supplier_lead_time_days: int
    supplier_reliability: str
    unit_price: str
    estimated_cost: str
    estimated_savings: str = "₹48,600.00"
    delivery_time_delta: str = "7 days → 4 days"
    is_perishable: bool = False
    shelf_life_days: Optional[int] = None
    days_until_expiry: Optional[float] = None
    waste_risk_status: Optional[str] = "NORMAL"
    supplier_dependency_pct: Optional[int] = 65
    is_single_point_of_failure: Optional[bool] = False
    ai_reasoning: str
    explainability: Optional[AIExplainabilityFactors] = None
    supplier_matrix: Optional[List[SupplierMatrixItem]] = []

class DeliveryOutcomeRequest(BaseModel):
    delivered_quantity: int
    defective_quantity: int = 0
    actual_lead_time_days: int
    notes: Optional[str] = "Verified dock receipt with zero defects"

class DeliveryOutcomeResponse(BaseModel):
    order_id: str
    supplier_id: str
    supplier_name: str
    sku: str
    delivered_quantity: int
    defective_quantity: int
    expected_days: int
    actual_days: int
    outcome_status: str
    previous_trust_score: int
    updated_trust_score: int
    previous_otif: str
    updated_otif: str
    previous_defect_rate: str
    updated_defect_rate: str
    score_delta: int
    restock_resolved_alerts: int
    message: str

class ClosedLoopWorkflowStateResponse(BaseModel):
    ai_recommendations_today: int
    restocks_prevented: int
    estimated_savings_total: str
    pending_approvals_count: int
    payments_completed_count: int
    suppliers_improved_count: int
    critical_stock_count: int
    low_stock_count: int
    normal_stock_count: int
    highest_risk_sku: Optional[dict] = None

# --- PROBLEM STATEMENT 7: RESILIENCE & SUSTAINABILITY SCHEMAS ---

class SupplierDependencyItem(BaseModel):
    sku: str
    product_name: str
    category: str
    primary_supplier_id: str
    primary_supplier_name: str
    supplier_dependency_pct: int
    is_single_point_of_failure: bool
    alternative_suppliers_count: int
    current_disruption_risk_pct: int
    diversified_disruption_risk_pct: int
    risk_reduction_pct: int
    ai_diversification_recommendation: str

class SupplierDependenciesResponse(BaseModel):
    total_skus: int
    spof_count: int
    dependencies: List[SupplierDependencyItem]

class ResilienceScoreResponse(BaseModel):
    resilience_score: int # 0-100 (e.g. 87)
    single_point_of_failure_risk: str # LOW, MEDIUM, HIGH
    critical_supplier_dependencies_count: int
    alternative_supplier_coverage_avg: float
    tier2_plus_visibility_pct: int # e.g. 76%
    waste_risk_rate: str # e.g. 8.4%
    authenticity_risk_level: str # LOW
    sme_supplier_opportunities_count: int
    estimated_co2_total: str # e.g. 12.4 tCO2e
    ai_resilience_recommendation: str
    critical_skus: List[SupplierDependencyItem]

class SupplierSustainabilityItem(BaseModel):
    supplier_id: str
    supplier_name: str
    supplier_tier: str
    location: str
    transport_mode: str
    distance_km: float
    shipment_weight_kg: float
    carbon_emission_factor: float
    estimated_co2_kg: float
    carbon_score: int # 0-100
    sustainability_rank: str # A+, A, B, C
    ai_recommendation: str

class SustainabilitySummaryResponse(BaseModel):
    total_estimated_co2_tonnes: float
    average_carbon_score: int
    cleanest_supplier: str
    transport_modes_breakdown: dict
    suppliers: List[SupplierSustainabilityItem]

class TierVisibilityResponse(BaseModel):
    tier_1_count: int
    tier_2_count: int
    tier_3_count: int
    total_suppliers: int
    tier_2_plus_visibility_pct: int # e.g. 76%
    visibility_status: str
    ai_insight: str
    tier_breakdown: List[dict]

class TraceabilityCheckItem(BaseModel):
    label: str
    verified: bool
    details: str

class ProductTraceabilityResponse(BaseModel):
    id: str
    batch_id: str
    sku: str
    product_name: str
    supplier_id: str
    supplier_name: str
    purchase_order_id: Optional[str] = None
    shipment_id: Optional[str] = None
    authentication_status: str # VERIFIED, PENDING, FLAGGED
    authenticity_risk_score: int # 0-100 (e.g. 8)
    traceability_checks: List[TraceabilityCheckItem]
    chain_of_custody: List[dict]
    created_at: datetime

class PerishableWasteRiskItem(BaseModel):
    sku: str
    product_name: str
    category: str
    warehouse: str
    on_hand: int
    average_daily_demand: float
    shelf_life_days: int
    expiry_date: str
    days_until_expiry: float
    days_until_stockout: float
    waste_risk_status: str # NORMAL, WASTE_RISK, EXPIRING_SOON, CRITICAL
    ai_recommendation: str

class PerishableWasteRiskResponse(BaseModel):
    total_perishables: int
    at_risk_count: int
    expiring_soon_count: int
    estimated_waste_prevented: str
    items: List[PerishableWasteRiskItem]

class SMEOpportunityItem(BaseModel):
    supplier_id: str
    supplier_name: str
    supplier_tier: str
    supplier_size: str
    location: str
    category: str
    sme_opportunity_score: int # 0-100 (e.g. 84)
    unit_price: str
    otif: str
    lead_time_days: int
    available_capacity_pct: int
    ai_rationale: str

class SMEOpportunityResponse(BaseModel):
    total_sme_suppliers: int
    sme_procurement_share_pct: int
    opportunities: List[SMEOpportunityItem]





