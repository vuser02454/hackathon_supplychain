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

class RestockRecommendationResponse(BaseModel):
    sku: str
    product_name: str
    warehouse: str
    current_stock: int
    safety_stock: int
    reorder_point: int
    severity: str
    stockout_risk: str
    days_until_stockout: float
    average_daily_demand: float
    recommended_quantity: int
    recommended_supplier: str
    supplier_lead_time_days: int
    supplier_reliability: str
    unit_price: str
    estimated_cost: str
    ai_reasoning: str



