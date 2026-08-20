# ⚡ SupplyChain.AI — Enterprise Platform

An autonomous, AI-driven supply chain orchestration platform featuring predictive inventory intelligence, real-time freight tracking, supplier performance analytics, dynamic restock approval workflows, and B2B payment settlement with smart escrow.

---

## 🌟 Functional Modules & Core Features

### 1. 🔐 Enterprise Authentication & Access Control (`/` / `index.html`)
- **Corporate SSO & Biometrics:** High-security login supporting simulated hardware biometric passkeys and corporate enterprise credentials.
- **Global Telemetry Canvas:** Live satellite backdrop with interactive telemetry metrics and real-time connection status.
- **Session Persistence:** Seamless token/profile storage with automatic redirection into the executive command center.

### 2. 📊 Executive Command Dashboard (`/dashboard` / `dashboard.html`)
- **Key Performance Indicators:** Real-time visibility into Global OTIF (*98.2%*), Elasticity Index (*87.4%*), Total In-Transit Cargo Value (*$4.2M*), and Carbon Intensity per TEU.
- **Interactive Global Logistics Map:** Interactive supply node hotspots (Shenzhen, Rotterdam, Chicago, Austin, Kolwezi) with real-time waypoint data.
- **Autonomous Disruption Alerts:** Proactive anomaly detection with suggested automated mitigation paths.
- **Active Operations Widgets:** Real-time freight status tracking, recent SKU turnover balances, and live alert feeds.

### 3. 📦 Inventory Intelligence & Stockout Risk Engine (`/inventory` / `inventory.html`)
- **Multi-Warehouse Balances:** Real-time SKU tracking across global distribution hubs (Chicago Cold Hub, Munich Central, Austin Hub, Shenzhen Depots).
- **Automated Risk Categorization:** Instant status badges (*Optimal*, *Low Buffer*, *Critical Low*) based on minimum safety stock thresholds.
- **1-Click Restock PO Drafting:** Direct modal action to generate purchase orders for depleted SKUs and route them into the approval pipeline.
- **Turnover & Cost Telemetry:** Metrics for inventory velocity, annual turnover rates, and unit cost evaluations.

### 4. 🚚 Freight Tracking & Logistics Hub (`/orders` / `orders.html`)
- **Live GPS Transit Monitoring:** End-to-end multi-modal shipment monitoring (Ocean, Air, Rail, Road).
- **Customs & Milestone Timeline:** Granular tracking of clearance checkpoints (Origin Cleared, Port Entry, Inbound Rail, Local Delivery).
- **Automated Shipment Expediting:** One-click rerouting and carrier prioritization for delayed shipments.
- **Order Management Modal:** Create, assign, and dispatch new purchase orders directly to active carriers with database persistence.

### 5. 🏭 Supplier Performance & Scorecards (`/suppliers` / `suppliers.html`)
- **AI-Vetted Trust Scoring:** Dynamic supplier trust scores (0–100) calculated from historical OTIF, defect rates, and SLA compliance.
- **Tier & Verification Badges:** Automated audit verification flags, lead-time variance tracking, and active contract monitoring.
- **Direct PO Procurement:** 1-click purchase order drafting tailored to supplier contract terms and inventory requirements.

### 6. 🤖 AI Intelligence Engine & Neural Copilot (`/ai-insights` / `ai-insights.html`)
- **💬 AI Chatbot & Copilot (Powered by Google Gemini API):** Interactive drawer assistant utilizing Google Gemini (`gemini-2.5-flash`) with live SQLite RAG telemetry data retrieval across orders, inventory, suppliers, approvals, and financial ledgers.
- **⚡ Autonomous AI Services (Powered by Groq API):** High-speed LLM engine utilizing Groq (`openai/gpt-oss-120b` / `qwen/qwen3.6-27b`) for all non-chatbot operations:
  - *Demand Surge Forecasting:* Multi-region predictive inventory surge calculations (`/api/ai/forecast-analysis`).
  - *Restock Quote Optimization:* Multi-vendor pricing arbitrage and SLA lead-time variance analysis (`/api/ai/restock-quote-analysis`).
  - *Supplier Risk Analytics:* Vendor vulnerability and historical defect trend profiling (`/api/ai/supplier-risk`).
  - *Disruption Mitigation:* Live transit delay mitigation and expedited route planning (`/api/ai/disruption-mitigation`).
- **Autonomous Recommendation Queue:** 1-click PO acceptance transferring AI restock suggestions into the financial approval desk.

### 7. ✍️ Restock Purchase Authorization Desk (`/restock-approval` / `restock-approval.html`)
- **Multi-Tier Financial Authorization:** Dual-tier authorization for high-value procurement exceeding enterprise financial limits.
- **Automated Vendor Quote Comparison:** Side-by-side pricing, lead-time, and reliability analysis for competing vendor quotes.
- **1-Click Approvals & ERP Sync:** Instant state updates with direct dispatch into active orders and integration with financial settlement.

### 8. 💳 B2B Payment Settlement & Smart Escrow Gateway (`/payments` / `payments.html`)
- **Multi-Rail Settlement:** Enterprise payment processing powered by Razorpay Enterprise, Fedwire ACH, and Smart Contract Escrow Vaults.
- **Smart Escrow Locking & Release:** Lock funds in milestone escrow vaults and release upon verified cargo delivery.
- **ERP Financial Ledger & Invoicing:** Real-time settlement ledger with instant invoice generation (`#INV-2026-XXXX`) and PDF-ready invoice viewing.
- **Refund & Dispute Management:** Real-time transaction reversal and financial audit logging.

### 9. 👤 Executive Profile & Credentials Management (`/profile` / `profile.html`)
- **Interactive Avatar Management:** 
  - Direct local photo file upload with real-time base64 encoding and live glowing preview.
  - 6 pre-curated executive avatar presets for instant 1-click selection.
  - Direct custom image URL support.
- **Personal & Directory Contact Editing:** Modify Full Name, Phone Number, Corporate Email ID, Executive Role, and Department.
- **Email Confirmation & Re-Authentication Security Workflow:** Enterprise security workflow where updating or confirming a corporate email address prompts a verification modal and securely redirects to the Authentication Portal (`index.html`) with prefilled credentials and a confirmation banner.
- **Platform-Wide Synchronization:** Dynamic header and sidebar avatar/name synchronization across all pages.

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** Responsive Dark-Theme Enterprise Glassmorphism (Tailwind CSS, Geist & Inter Typography, Material Symbols, `supplychain.js` unified client engine).
- **Backend API:** FastAPI (Python 3.11+) with SQLite & SQLAlchemy ORM.
- **AI Dual-Engine Architecture:**
  - **Chatbot & Copilot:** Exclusively powered by **Google Gemini API** (`gemini-2.5-flash`) with RAG database context injection.
  - **Non-Chatbot Services:** Exclusively powered by **Groq API** (`openai/gpt-oss-120b` / `groq` SDK) for forecasting, disruption mitigation, supplier risk, and restock quote arbitrage.
- **Data Layer:** SQLite with automatic startup seeding (`backend/seed_data.py`).
- **Interactive Documentation:** OpenAPI / Swagger UI (`/docs`) and ReDoc (`/redoc`).

---

## 📁 Directory Structure

```
├── main.py                                            # Unified application launcher (FastAPI / Uvicorn)
├── supplychain.js                                     # Central client engine (State, Modals, AI Copilot, Toast)
├── global_supply_map.jpg                              # Telemetry visual asset & global map
├── index.html                                         # 🔐 Authentication Portal
├── dashboard.html                                     # 📊 Executive Dashboard
├── profile.html                                       # 👤 Executive Profile & Settings
├── inventory.html                                     # 📦 Inventory Intelligence
├── orders.html                                         # 🚚 Freight Logistics & Orders
├── suppliers.html                                     # 🏭 Supplier Performance & Scorecards
├── ai-insights.html                                   # 🤖 AI Demand Forecasting & Copilot
├── restock-approval.html                              # ✍️ Restock Purchase Authorization Desk
├── payments.html                                      # 💳 B2B Payment Gateway & Smart Escrow
├── backend/
│   ├── main.py                                        # FastAPI Application & Static Asset Routing
│   ├── database.py                                    # SQLAlchemy SQLite Database Session & Engine
│   ├── models.py                                      # Database Models (Users, Orders, Inventory, Suppliers, POs, Payments)
│   ├── schemas.py                                     # Pydantic Request/Response Data Contracts
│   ├── seed_data.py                                   # Database Seeder & Initial Mock Datasets
│   ├── ai_service.py                                  # RAG Copilot & Multi-Model Simulation Engine
│   └── routers/
│       ├── auth.py                                    # Authentication & User Profile APIs
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
cd wdygey-main

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Variables (Optional)

Create a `.env` file in the root directory to enable external AI model providers:

```env
# Optional: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: OpenRouter API Key
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional: Razorpay Test Credentials
RAZORPAY_KEY_ID=rzp_test_TRvxs42XlaI4PB
RAZORPAY_KEY_SECRET=secret_TRvxs42XlaI4PB_test
```

*(Note: The platform includes built-in offline RAG fallbacks and test payment keys, allowing full local execution without external API keys).*

### 4. Start the Application

```bash
python main.py
```

---

## ☁️ Deployment Guides

### 🟣 Deploy to Render (Recommended for Full Python FastAPI & WebSockets)

Render provides native FastAPI Python hosting with automatic continuous deployment on every GitHub push.

#### Option A: 1-Click Blueprints (Using `render.yaml`)
1. Log in to **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** $\rightarrow$ **Blueprint**.
3. Connect your GitHub repository: `https://github.com/vuser02454/hackathon_supplychain`.
4. Render will automatically detect [`render.yaml`](render.yaml) and configure the web service.
5. Add your Environment Variables in the Render UI (`SUPABASE_URL`, `SUPABASE_KEY`, `OPENROUTER_API_KEY`, etc.).
6. Click **Apply** to build and deploy.

#### Option B: Manual Web Service Setup
1. In Render, click **New +** $\rightarrow$ **Web Service**.
2. Connect your repository `hackathon_supplychain`.
3. Configure the following fields:
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables under **Environment**:
   - `PYTHON_VERSION`: `3.11.9`
   - `SUPABASE_URL`: `https://jqkgavoculcubjqwgsrae.supabase.co`
   - `SUPABASE_KEY`: `your_supabase_anon_key`
   - `OPENROUTER_API_KEY`: `your_openrouter_api_key`
5. Click **Create Web Service**.

---

### ▲ Deploy to Vercel (Serverless Python & Global CDN)

The repository includes [`vercel.json`](vercel.json) pre-configured to route API requests to FastAPI and static assets to Vercel's Edge Network.

#### Deployment Steps:
1. Log in to **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository: `vuser02454/hackathon_supplychain`.
4. In **Project Settings**:
   - **Framework Preset:** `Other`
   - **Root Directory:** `./`
5. Expand **Environment Variables** and add:
   - `SUPABASE_URL`: `https://jqkgavoculcubjqwgsrae.supabase.co`
   - `SUPABASE_KEY`: `your_supabase_anon_key`
   - `OPENROUTER_API_KEY`: `your_openrouter_api_key`
   - `GEMINI_API_KEY`: `your_gemini_api_key`
6. Click **Deploy**. Vercel will build and assign your production URL (e.g. `https://hackathon-supplychain.vercel.app`).

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
