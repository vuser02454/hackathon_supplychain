# ⚡ SupplyChain.AI — Autonomous Enterprise Logistics & Financial Intelligence

An autonomous, AI-driven supply chain orchestration platform featuring predictive inventory intelligence, real-time freight tracking, supplier performance analytics, dynamic restock approval workflows, Supabase cloud database integration, and B2B payment settlement in Indian Rupees (₹) with smart escrow.

---

## 🌟 Functional Modules & Core Features

### 1. 🔐 Enterprise Authentication & Cloud Sync (`/` / `index.html`)
- **Corporate SSO & Biometrics:** High-security login supporting simulated hardware biometric passkeys and corporate enterprise credentials.
- **Supabase Cloud Sync:** Real-time user database persistence with Supabase PostgreSQL.
- **Global Telemetry Canvas:** Live satellite backdrop with interactive telemetry metrics and connection status.

### 2. 📊 Executive Command Dashboard (`/dashboard` / `dashboard.html`)
- **Key Performance Indicators:** Real-time visibility into Global OTIF (*98.2%*), Elasticity Index (*87.4%*), Total In-Transit Cargo Value (*₹34.8 Cr*), and Cost Savings (*₹1.42 Cr*).
- **Interactive Global Logistics Map:** Interactive supply node hotspots (Shenzhen, Rotterdam, Chicago, Austin, Kolwezi) with real-time waypoint data.
- **Autonomous Disruption Alerts:** Proactive anomaly detection with suggested automated mitigation paths.

### 3. 📦 Inventory Intelligence & Stockout Risk Engine (`/inventory` / `inventory.html`)
- **Multi-Warehouse Balances:** Real-time SKU tracking across global distribution hubs (Chicago Cold Hub, Munich Central, Austin Hub, Tokyo Depot).
- **Automated Risk Categorization:** Instant status badges (*Optimal*, *Warning*, *Critical Low*) based on minimum safety stock thresholds.
- **1-Click Restock PO Drafting:** Direct modal action to generate purchase orders for depleted SKUs with live unit pricing in Indian Rupees (`₹`).

### 4. 🚚 Freight Tracking & Logistics Hub (`/orders` / `orders.html`)
- **Live GPS Transit Monitoring:** End-to-end multi-modal shipment monitoring (Ocean, Air, Rail, Road).
- **Customs & Milestone Timeline:** Granular tracking of clearance checkpoints (Origin Cleared, Port Entry, Inbound Rail, Local Delivery).
- **Automated Shipment Expediting:** One-click rerouting and carrier prioritization for delayed shipments.

### 5. 🏭 Supplier Performance & Scorecards (`/suppliers` / `suppliers.html`)
- **AI-Vetted Trust Scoring:** Dynamic supplier trust scores (0–100) calculated from historical OTIF, defect rates, and SLA compliance.
- **Tier & Verification Badges:** Automated audit verification flags, lead-time variance tracking, and active contract monitoring.

### 6. 🤖 AI Demand Forecasting & Sourcing Matrix (`/ai-insights` / `ai-insights.html`)
- **📊 Previous Purchase Pattern Telemetry:** Evaluates 90-day historical order velocity, reorder cycle frequencies, and sell-through rates.
- **💹 Future Financial Forecasting (Profit vs. Loss):** Explicitly classifies each stock cycle with projected dollar ROI (`🟢 Projected Profit: +₹42,800` vs `🔴 Risk Avoidance: -₹14,500`).
- **🔄 Interactive Vendor Decision Matrix:** Toggle between keeping the **Same Incumbent Vendor** or switching to **Popular / Trusted Tier-1 Vendors** with instant cost/lead-time comparison and 1-click PO drafting.
- **💬 Interactive Neural Copilot:** Powered by OpenRouter (`sk-or-v1-...`), Groq (`openai/gpt-oss-120b`), and Google Gemini (`gemini-2.5-flash`).

### 7. ✍️ Restock Purchase Authorization Desk (`/restock-approval` / `restock-approval.html`)
- **Multi-Tier Financial Authorization:** Dual-tier authorization for procurement exceeding enterprise financial limits.
- **Side-by-Side Vendor Quotes:** Pricing, lead-time, and reliability analysis for competing vendor quotes in `₹ INR`.
- **1-Click Approvals & ERP Sync:** Instant state updates with direct dispatch into active orders and integration with financial settlement.

### 8. 💳 B2B Payment Settlement & Smart Escrow Gateway (`/payments` / `payments.html`)
- **Multi-Rail Settlement:** Enterprise payment processing powered by Razorpay Enterprise, Fedwire ACH, and Smart Contract Escrow Vaults.
- **Smart Escrow Locking & Release:** Lock funds in milestone escrow vaults (`₹34,800.00`) and release upon verified cargo delivery.
- **ERP Financial Ledger & Invoicing:** Real-time settlement ledger with instant invoice generation (`#INV-2026-XXXX`) and PDF-ready viewing in `₹ INR`.

### 9. 👤 Executive Profile & Credentials Management (`/profile` / `profile.html`)
- **Interactive Avatar Management:** Custom photo file upload, 6 executive preset avatars, and custom image URL support.
- **Personal & Directory Contact Editing:** Modify Full Name, Phone Number, Corporate Email ID, Role, and Department.
- **Email Confirmation & Re-Authentication Flow:** Enterprise security workflow returning to `index.html` with verification confirmation banner.
- **Supabase Cloud Sync:** Real-time automatic persistence to Supabase `users` table.

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** Responsive Dark-Theme Enterprise Glassmorphism (Tailwind CSS, Geist & Inter Typography, Material Symbols, `supplychain.js` unified client engine).
- **Backend API:** FastAPI (Python 3.11+) with SQLite / PostgreSQL & SQLAlchemy ORM.
- **Cloud Database:** **Supabase PostgreSQL** with automated table sync and Row-Level Security (RLS).
- **AI Multi-Model Dual Engine:**
  - **OpenRouter API & Google Gemini:** Neural demand forecasting and interactive RAG Copilot.
  - **Groq API Acceleration:** High-speed LLM inference (`openai/gpt-oss-120b`).
- **Payment Processing:** Razorpay Enterprise Test Gateway in Indian Rupees (`₹ INR`).

---

## 📁 Directory Structure

```
├── main.py                                            # Unified application launcher (FastAPI / Uvicorn)
├── supplychain.js                                     # Central client engine (State, Modals, AI Copilot, Toast)
├── global_supply_map.jpg                              # Telemetry visual asset & global map
├── vercel.json                                        # Vercel Deployment & Routing Configuration
├── render.yaml                                        # Render Cloud Blueprint Configuration
├── index.html                                         # 🔐 Authentication Portal
├── dashboard.html                                     # 📊 Executive Dashboard
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
│   ├── models.py                                      # Database Models (Users, Orders, Inventory, Suppliers, POs, Payments)
│   ├── schemas.py                                     # Pydantic Request/Response Data Contracts
│   ├── seed_data.py                                   # Database Seeder & Mock Datasets (₹ INR)
│   ├── supabase_service.py                            # Supabase Cloud Database Client & User Sync
│   ├── ai_service.py                                  # RAG Copilot & Multi-Model Forecasting Engine
│   └── routers/
│       ├── auth.py                                    # Authentication & User Profile APIs (Supabase synced)
│       ├── orders.py                                  # Orders & Freight Tracking APIs
│       ├── inventory.py                               # Inventory Level & SKU APIs
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

## ☁️ Cloud Deployment Guides

### ▲ Deploy to Vercel (Recommended for Global Edge Hosting)

1. Log in to **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click **Add New...** $\rightarrow$ **Project** and import `vuser02454/hackathon_supplychain`.
3. In **Project Settings**:
   - **Framework Preset:** `Other`
   - **Root Directory:** `./`
4. Under **Environment Variables**, add:
   - `SUPABASE_URL`: `https://jqkgavoculcubjqwgsrae.supabase.co`
   - `SUPABASE_KEY`: `your_supabase_anon_key`
   - `OPENROUTER_API_KEY`: `your_openrouter_api_key`
   - `GEMINI_API_KEY`: `your_gemini_api_key`
   - `GROQ_API_KEY`: `your_groq_api_key`
5. Click **Deploy**.

---

### 🟣 Deploy to Render (Web Service)

1. Log in to **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** $\rightarrow$ **Web Service** and connect `hackathon_supplychain`.
3. Configure settings:
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Under **Environment Variables**, add `PYTHON_VERSION=3.11.9`, `SUPABASE_URL`, `SUPABASE_KEY`, `OPENROUTER_API_KEY`, etc.
5. Click **Create Web Service**.

---

## 🌐 Available Application URLs & Endpoints

| Resource | URL | Description |
| :--- | :--- | :--- |
| **Authentication Portal** | [http://localhost:8000/](http://localhost:8000/) | Enterprise login portal |
| **Executive Dashboard** | [http://localhost:8000/dashboard](http://localhost:8000/dashboard) | Central command dashboard |
| **Profile & Settings** | [http://localhost:8000/profile](http://localhost:8000/profile) | Executive profile, photo, phone, & Supabase sync |
| **Freight Tracking** | [http://localhost:8000/orders](http://localhost:8000/orders) | Live shipment tracking |
| **Inventory Intelligence**| [http://localhost:8000/inventory](http://localhost:8000/inventory) | Stock & warehouse management in ₹ INR |
| **Supplier Scorecards** | [http://localhost:8000/suppliers](http://localhost:8000/suppliers) | Vendor ratings & metrics |
| **AI Demand Forecasting**| [http://localhost:8000/ai-insights](http://localhost:8000/ai-insights) | Neural profit/loss forecast & vendor arbitrage |
| **Restock Approvals** | [http://localhost:8000/restock-approval](http://localhost:8000/restock-approval) | Purchase order authorization desk |
| **Payment Gateway** | [http://localhost:8000/payments](http://localhost:8000/payments) | B2B payment & escrow portal in ₹ INR |
| **Interactive API Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) | Swagger UI for all backend endpoints |
| **ReDoc Documentation** | [http://localhost:8000/redoc](http://localhost:8000/redoc) | Alternative OpenAPI documentation |
| **Health Check** | [http://localhost:8000/api/health](http://localhost:8000/api/health) | Platform status & subsystem health |

---

## 🛡️ License & Copyright

© 2026 SupplyChain.AI Enterprise Platform. All rights reserved.
