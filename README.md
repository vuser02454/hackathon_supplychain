# ⚡ SupplyChain.AI — Autonomous Enterprise Logistics & Financial Intelligence

An autonomous, AI-driven supply chain orchestration platform featuring predictive inventory intelligence, real-time freight tracking, supplier performance analytics, dynamic restock approval workflows, Supabase cloud database integration, low-stock threshold monitoring with automated email notifications, and B2B payment settlement in Indian Rupees (₹) with smart escrow.

---

## 🌟 Functional Modules & Core Features

### 1. 🔐 Enterprise Authentication & Cloud Sync (`/` / `index.html`)
- **Corporate SSO & Biometrics:** High-security login supporting simulated hardware biometric passkeys and corporate enterprise credentials.
- **Supabase Cloud Sync:** Real-time user database persistence with Supabase PostgreSQL.
- **Global Telemetry Canvas:** Live satellite backdrop with interactive telemetry metrics and connection status.

### 2. 📊 Executive Command Dashboard (`/dashboard` / `dashboard.html`)
- **Key Performance Indicators:** Real-time visibility into Global OTIF (*98.2%*), Elasticity Index (*87.4%*), Total In-Transit Cargo Value (*₹34.8 Cr*), and Cost Savings (*₹1.42 Cr*).
- **Interactive Global Logistics Map:** Interactive supply node hotspots (Shenzhen, Rotterdam, Chicago, Austin, Kolwezi) with real-time waypoint data.
- **Inventory Risk & Stockout Forecast Widget:** Live counters for Critical, Low Stock, and Normal inventory, with Highest Risk SKU spotlight and Days-to-Stockout countdown.

### 3. 🚨 Low Stock Alerts & Email Notification System (`/api/inventory/alerts`)
- **Continuous Threshold Evaluation:** Automatically monitors inventory records, classifying items into `NORMAL`, `LOW` (below safety stock), and `CRITICAL` (below 50% safety stock).
- **Duplicate Prevention Engine:** Deduplicates open alerts per `organization_id + sku + severity` to eliminate redundant email spamming.
- **Production Email Service (`backend/email_service.py`):** Dispatches rich HTML & plain-text alert emails via **Resend API** with graceful fallback logging if API keys are unconfigured.
- **Top Navigation Bell & Alert Center:** Live pulsating badge count on the topbar bell with slide-over drawer displaying alert telemetry, email dispatch status, and 1-click AI restock reviews.
- **Automated Resolution:** Open alerts are automatically resolved when inventory is replenished above safety thresholds.

### 4. 🧠 AI Sourcing Intelligence & Restock Proposals
- **Predictive Restock Parameters:** Neural calculation of **Days Until Stockout**, **Recommended Order Quantity**, preferred vendor reliability, and total estimated PO costs in `₹ INR`.
- **Human-in-the-Loop Safeguard:** AI recommendations do NOT place orders automatically. Reviewers inspect parameters, modify quantities, and explicitly approve into the Restock Authorization Desk.

### 5. 📦 Inventory Intelligence & Warehouse Balances (`/inventory` / `inventory.html`)
- **Multi-Warehouse Balances:** Real-time SKU tracking across global distribution hubs (Chicago Cold Hub, Munich Central, Austin Hub, Tokyo Depot).
- **Automated Risk Categorization:** Instant status badges (*Optimal*, *Low Buffer*, *Critical Low*) based on minimum safety stock thresholds.
- **1-Click Restock PO Drafting:** Direct modal action to generate purchase orders with live unit pricing in Indian Rupees (`₹`).

### 6. 🚚 Freight Tracking & Logistics Hub (`/orders` / `orders.html`)
- **Live GPS Transit Monitoring:** End-to-end multi-modal shipment monitoring (Ocean, Air, Rail, Road).
- **Customs & Milestone Timeline:** Granular tracking of clearance checkpoints (Origin Cleared, Port Entry, Inbound Rail, Local Delivery).
- **Automated Shipment Expediting:** One-click rerouting and carrier prioritization for delayed shipments.

### 7. 🏭 Supplier Performance & Scorecards (`/suppliers` / `suppliers.html`)
- **AI-Vetted Trust Scoring:** Dynamic supplier trust scores (0–100) calculated from historical OTIF, defect rates, and SLA compliance.
- **Tier & Verification Badges:** Automated audit verification flags, lead-time variance tracking, and active contract monitoring.

### 8. 🤖 AI Demand Forecasting & Sourcing Matrix (`/ai-insights` / `ai-insights.html`)
- **📊 Previous Purchase Pattern Telemetry:** Evaluates 90-day historical order velocity, reorder cycle frequencies, and sell-through rates.
- **💹 Future Financial Forecasting (Profit vs. Loss):** Explicitly classifies each stock cycle with projected dollar ROI (`🟢 Projected Profit: +₹42,800` vs `🔴 Risk Avoidance: -₹14,500`).
- **🔄 Interactive Vendor Decision Matrix:** Toggle between keeping the **Same Incumbent Vendor** or switching to **Popular / Trusted Tier-1 Vendors** with instant cost/lead-time comparison and 1-click PO drafting.
- **💬 Interactive Neural Copilot:** Powered by OpenRouter (`sk-or-v1-...`), Groq (`openai/gpt-oss-120b`), and Google Gemini (`gemini-2.5-flash`).

### 9. ✍️ Restock Purchase Authorization Desk (`/restock-approval` / `restock-approval.html`)
- **Multi-Tier Financial Authorization:** Dual-tier authorization for procurement exceeding enterprise financial limits.
- **Side-by-Side Vendor Quotes:** Pricing, lead-time, and reliability analysis for competing vendor quotes in `₹ INR`.
- **1-Click Approvals & ERP Sync:** Instant state updates with direct dispatch into active orders and integration with financial settlement.

### 10. 💳 B2B Payment Settlement & Smart Escrow Gateway (`/payments` / `payments.html`)
- **Multi-Rail Settlement:** Enterprise payment processing powered by Razorpay Enterprise, Fedwire ACH, and Smart Contract Escrow Vaults.
- **Smart Escrow Locking & Release:** Lock funds in milestone escrow vaults (`₹34,800.00`) and release upon verified cargo delivery.
- **ERP Financial Ledger & Invoicing:** Real-time settlement ledger with instant invoice generation (`#INV-2026-XXXX`) and PDF-ready viewing in `₹ INR`.

### 11. 👤 Executive Profile & Credentials Management (`/profile` / `profile.html`)
- **Interactive Avatar Management:** Custom photo file upload, 6 executive preset avatars, and custom image URL support.
- **Personal & Directory Contact Editing:** Modify Full Name, Phone Number, Corporate Email ID, Role, and Department.
- **Email Confirmation & Re-Authentication Flow:** Enterprise security workflow returning to `index.html` with verification confirmation banner.
- **Supabase Cloud Sync:** Real-time automatic persistence to Supabase `users` and `inventory_alerts` tables.

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** Responsive Dark-Theme Enterprise Glassmorphism (Tailwind CSS, Geist & Inter Typography, Material Symbols, `supplychain.js` unified client engine).
- **Backend API:** FastAPI (Python 3.11+) with SQLite / PostgreSQL & SQLAlchemy ORM.
- **Cloud Database:** **Supabase PostgreSQL** with automated table sync and Row-Level Security (RLS).
- **Email Notification Service:** Resend API integration (`backend/email_service.py`) with resilient logging fallback.
- **AI Multi-Model Dual Engine:**
  - **OpenRouter API & Google Gemini:** Neural demand forecasting and interactive RAG Copilot.
  - **Groq API Acceleration:** High-speed LLM inference (`openai/gpt-oss-120b`).
- **Payment Processing:** Razorpay Enterprise Test Gateway in Indian Rupees (`₹ INR`).

---

## 📁 Directory Structure

```
├── main.py                                            # Unified application launcher (FastAPI / Uvicorn)
├── supplychain.js                                     # Central client engine (State, Modals, AI Copilot, Alerts, Toast)
├── global_supply_map.jpg                              # Telemetry visual asset & global map
├── vercel.json                                        # Vercel Deployment & Routing Configuration
├── render.yaml                                        # Render Cloud Blueprint Configuration
├── index.html                                         # 🔐 Authentication Portal
├── dashboard.html                                     # 📊 Executive Dashboard & Inventory Risk Widget
├── profile.html                                       # 👤 Executive Profile & Settings
├── inventory.html                                     # 📦 Inventory Intelligence (₹ INR)
├── orders.html                                         # 🚚 Freight Logistics & Orders
├── suppliers.html                                     # 🏭 Supplier Performance & Scorecards
├── ai-insights.html                                   # 🤖 AI Demand Forecasting & Vendor Switching
├── restock-approval.html                              # ✍️ Restock Purchase Authorization Desk
├── payments.html                                      # 💳 B2B Payment Gateway & Smart Escrow (₹ INR)
├── backend/
│   ├── main.py                                        # FastAPI Application & Static Asset Routing
│   ├── database.py                                    # SQLAlchemy Database Session & Engine
│   ├── models.py                                      # Database Models (Users, Orders, Inventory, Alerts, Suppliers, POs, Payments)
│   ├── schemas.py                                     # Pydantic Request/Response Data Contracts
│   ├── seed_data.py                                   # Database Seeder & Mock Datasets (₹ INR)
│   ├── email_service.py                               # Resend Email Notification Service & Fallback
│   ├── supabase_service.py                            # Supabase Cloud Database Client & User/Alerts Sync
│   ├── ai_service.py                                  # RAG Copilot, Low Stock Sourcing, & Forecasting Engine
│   └── routers/
│       ├── auth.py                                    # Authentication & User Profile APIs (Supabase synced)
│       ├── inventory.py                               # Inventory Level, Alerts, Stock Scan, & Demo Simulator APIs
│       ├── orders.py                                  # Orders & Freight Tracking APIs
│       ├── suppliers.py                               # Supplier Scorecard APIs
│       ├── approvals.py                               # Restock Purchase Approval APIs
│       ├── ai.py                                      # Neural Copilot & Forecasting APIs
│       └── payments.py                                # B2B Payment Gateway & Escrow APIs
└── requirements.txt                                   # Python Dependencies
```

---

## 🚀 Running Locally

### 1. Prerequisites
- Python 3.11 or higher
- Virtual environment tool (`venv`)

### 2. Setup & Installation

```bash
# Clone or navigate to the repository
git clone https://github.com/vuser02454/hackathon_supplychain.git
cd hackathon_supplychain

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Variables (`.env`)

Create a `.env` file in the root directory:

```env
# AI Model Providers
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# Supabase Cloud Database
SUPABASE_URL=https://jqkgavoculcubjqwgsrae.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# Email Notification Provider (Resend)
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=SupplyChain.AI Alerts <onboarding@resend.dev>

# Razorpay Test Credentials
RAZORPAY_KEY_ID=rzp_test_TRvxs42XlaI4PB
RAZORPAY_KEY_SECRET=secret_TRvxs42XlaI4PB_test
```

### 4. Start the Local Server

```bash
python main.py
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## ⚡ Hackathon Demo Walkthrough (Simulate Stockout)

To demonstrate the full autonomous sourcing and alerting pipeline to judges:

1. Open **[Dashboard](http://localhost:8000/dashboard)**.
2. In the **Inventory Risk & Stockout Forecast** widget, click **`⚡ DEMO: Simulate Stockout`**.
3. **Instant Event Reactions**:
   - Stock for `SKU-AVO-303` drops to 12 units.
   - Live toast notification fires: `🚨 CRITICAL STOCK ALERT`.
   - Topbar notification bell illuminates with a pulsating red badge.
   - Email dispatch is triggered via backend service.
4. **AI Sourcing Proposal Dialog**:
   - Opens showing stockout countdown (`~0.4 Days remaining`) and optimal replenishment calculation (`688 Units` at `₹19,264.00 INR`).
5. **Human Approval & Settlement**:
   - Click **`Approve Restock & Route to PO`** $\rightarrow$ Authorize in **Restock Approvals** $\rightarrow$ Unlock and complete **Razorpay Escrow Payment** in **Payments**!

---

## 🌐 Available Application URLs & Endpoints

| Resource | URL / Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Authentication Portal** | `/` | GET | Enterprise login portal & biometrics |
| **Executive Dashboard** | `/dashboard` | GET | Central command dashboard & Risk widget |
| **Profile & Settings** | `/profile` | GET | Executive profile, photo, phone, & Supabase sync |
| **Inventory Intelligence**| `/inventory` | GET | Stock & warehouse management in ₹ INR |
| **Freight Tracking** | `/orders` | GET | Live shipment tracking & milestone timeline |
| **Supplier Scorecards** | `/suppliers` | GET | Vendor ratings, OTIF, & trust metrics |
| **AI Demand Forecasting**| `/ai-insights` | GET | Neural profit/loss forecast & vendor arbitrage |
| **Restock Approvals** | `/restock-approval` | GET | Purchase order authorization desk |
| **Payment Gateway** | `/payments` | GET | B2B payment & escrow portal in ₹ INR |
| **Scan Inventory Thresholds**| `/api/inventory/check-stock` | POST | Runs threshold scan & generates alert emails |
| **Unread Alerts Summary** | `/api/inventory/alerts/unread` | GET | Unread count & severity summary for topbar bell |
| **Inventory Alerts Roster** | `/api/inventory/alerts` | GET | Full alert history with resolved filters |
| **Simulate Stockout Demo** | `/api/inventory/simulate-stockout`| POST | Hackathon demo simulation trigger |
| **AI Restock Proposal** | `/api/inventory/{sku}/restock-recommendation` | POST | Neural stockout calculation & supplier quote |
| **Interactive API Docs** | `/docs` | GET | Swagger UI for all backend endpoints |

---

## 🛡️ License & Copyright

© 2026 SupplyChain.AI Enterprise Platform. All rights reserved.
