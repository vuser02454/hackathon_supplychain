# ⚡ SupplyChain.AI — Closed-Loop Supply-Chain Intelligence Engine

An autonomous, AI-driven supply chain orchestration platform featuring predictive stockout forecasting, multi-attribute vendor decision matrices, dynamic human authorization workflows, Razorpay payment settlement in Indian Rupees (₹), real-time logistics telemetry, automated delivery outcome learning, and closed-loop supplier score updating.

---

## 🔄 The Closed-Loop Intelligence Story

The central capability of SupplyChain.AI is a complete **22-step closed-loop feedback engine** where operational delivery outcomes directly train future AI procurement decisions:

```
INVENTORY DROPS (Warehouse Level)
      ↓
LOW-STOCK DETECTION (Safety Stock Breach)
      ↓
WEBSITE ALERT + USER EMAIL (Dynamic Recipient Resolution)
      ↓
AI STOCKOUT PREDICTION (Days to Stockout & Velocity Calculation)
      ↓
AI SUPPLIER COMPARISON (Multi-Attribute Utility Function Matrix)
      ↓
AI RECOMMENDATION & EXPLAINABILITY (Explicit Points: Cost +18, Speed +24, OTIF +22, Defect +17, Stockout +20)
      ↓
HUMAN APPROVAL SAFEGUARD (Review, Modify Quantity, Authorize PO)
      ↓
PURCHASE ORDER (#PO-2026-XXXX)
      ↓
RAZORPAY PAYMENT SETTLEMENT (₹ INR Gateway & Smart Escrow)
      ↓
SHIPMENT CREATED (Automated Order Dispatch)
      ↓
IN-TRANSIT TELEMETRY (Simulated GPS & Checkpoint Progression)
      ↓
DELIVERY OUTCOME RECORDED (Dock QA: Lead Time, Defect Count)
      ↓
SUPPLIER PERFORMANCE UPDATED (Dynamic Trust Score Delta e.g. 84 → 91 ↑)
      ↓
AI USES OUTCOME FOR FUTURE SOURCING DECISIONS (Closed-Loop Feedback)
```

---

## 🎬 8-Step End-to-End Demo Script

| Step | Action | Platform Reaction | Closed-Loop Milestone |
| :--- | :--- | :--- | :--- |
| **1. Stock Scan** | Click `[Scan Telemetry]` on Dashboard or Inventory | Evaluates safety buffers across warehouses | Critical stock breaches identified |
| **2. Dynamic Alert** | Background notification engine runs | Dispatches email directly to the logged-in user's email address | Bell lights up with pulsating badge |
| **3. AI Sourcing Matrix** | Click `Review AI Sourcing & Decision Matrix` | Generates 5-vendor comparison with factor scores (`+18`, `+24`, `+22`, `+17`, `+20`) | Risk reduction: `82% → 14%`, Savings: `₹48,600` |
| **4. Human Authorization** | Adjust quantity & click `[Approve Restock & Create PO]` | Drafts Purchase Order `#PO-2026-XXXX` (`APPROVED / PAYMENT_PENDING`) | Human-in-the-loop compliance locked |
| **5. Razorpay Settlement** | Complete test payment or Lock Escrow in `₹ INR` | Verifies HMAC signature & records ERP ledger | PO marked `PAID`, shipment spawned |
| **6. Shipment Telemetry** | Navigate to `/orders` & click `[Advance to In-Transit]` | Moves status from `SHIPMENT_CREATED` (25%) to `IN_TRANSIT` (68%) | Real-time cargo checkpoint recorded |
| **7. Dock Delivery QA** | Click `[Mark Delivered & Record Outcome]` | Inputs dock receipt: 500 units, 0 defects, 2 days lead time | Order marked `DELIVERED` (100%) |
| **8. Supplier Learning** | Navigate to `/suppliers` or view scorecards | Supplier Trust Score recalculates: `84 → 91 ↑ (+7 pts)` | Future AI restock plans prioritize vendor |

---

## 🌟 Functional Modules & Core Features

### 1. 🚨 Low Stock Alerts & Dynamic User Email Notification System (`/api/inventory/alerts`)
- **Continuous Threshold Evaluation:** Automatically monitors inventory records, classifying items into `NORMAL`, `LOW` (below safety stock), and `CRITICAL` (below 50% safety stock).
- **Dynamic Logged-In User Routing:** Automatically sends notification emails directly to the **active logged-in user's email address** (or the email saved in Profile & Settings). No hardcoded emails.
- **Duplicate Prevention Engine:** Deduplicates open alerts per `organization_id + sku + severity` to eliminate redundant email spamming.
- **Production Email Service (`backend/email_service.py`):** Dispatches dark-themed HTML & plain-text alert emails via **Resend API** with graceful fallback logging.
- **Top Navigation Bell & Alert Center:** Live pulsating badge count on the topbar bell with slide-over drawer displaying alert telemetry, email dispatch status, and 1-click AI restock reviews.
- **Automated Resolution:** Open alerts are automatically resolved when inventory is replenished above safety thresholds.

### 2. 🧠 AI Multi-Supplier Decision Matrix & Explainability (`backend/ai_service.py`)
- **Multi-Attribute Utility Function:** Evaluates candidate suppliers across 5 normalized dimensions:
  - **Unit Pricing:** Normalized in Indian Rupees (`₹ INR`).
  - **Delivery Speed:** Lead time vs. projected stockout window.
  - **OTIF Reliability SLA:** Historical on-time in-full ratings.
  - **Defect History:** Quality audit records.
  - **Trust Score Bonus:** Historical fulfillment performance deltas.
- **Explainability Scoring Breakdown:**
  - `Cost Advantage`: **+18 pts**
  - `Delivery Speed`: **+24 pts**
  - `OTIF Reliability`: **+22 pts**
  - `Defect History`: **+17 pts**
  - `Stockout Shield`: **+20 pts**
  - `Overall Neural Confidence`: **91%**
- **Impact Metrics:** Quantifies Risk Reduction (`82% → 14%`), Estimated Cost Savings (`₹48,600.00`), and Delivery Acceleration (`7 days → 4 days`).
- **Human-in-the-Loop Safeguard:** AI recommendations do NOT place orders automatically. Reviewers inspect parameters, adjust quantities in real time, and explicitly approve into the Restock Authorization Desk.

### 3. 💳 B2B Payment Settlement & Smart Escrow Gateway (`/payments` / `payments.html`)
- **Multi-Rail Settlement:** Enterprise payment processing powered by Razorpay Enterprise in Indian Rupees (`₹ INR`), Fedwire ACH, and Smart Contract Escrow Vaults.
- **Automated PO Bridge:** Seamlessly links approved Purchase Orders to checkout, verifies HMAC signatures, records ERP ledgers, and auto-generates active shipment tracking.

### 4. 🚚 Freight Tracking & Shipment Telemetry (`/orders` / `orders.html`)
- **Simulated Logistics Telemetry:** Transparently labeled simulated GPS transit monitoring and checkpoint milestones (`SHIPMENT_CREATED` → `IN_TRANSIT` → `DELIVERED`).
- **One-Click Progression:** Advance checkpoints and trigger dock receipt verification.

### 5. 🏭 Delivery Outcome Recording & Dynamic Supplier Learning (`/suppliers` / `suppliers.html`)
- **Receipt Verification:** Log delivered quantity, defect count, and actual transit days.
- **Scorecard Learning:** Automatically recalculates supplier Trust Score (e.g. `+7 pts` for early zero-defect deliveries), OTIF rating, and defect rate.
- **Historical Ledger (`SupplierPerformanceHistoryModel`):** Permanent audit trail queried by the AI engine for future sourcing decisions.
- **Inventory Replenishment:** Automatically replenishes warehouse balances and resolves open stockout alerts.

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** Responsive Dark-Theme Enterprise Glassmorphism (Tailwind CSS, Geist & Inter Typography, Material Symbols, `supplychain.js` unified client engine).
- **Backend API:** FastAPI (Python 3.11+) with SQLite / PostgreSQL & SQLAlchemy ORM.
- **Cloud Database:** **Supabase PostgreSQL** with automated table sync and Row-Level Security (RLS).
- **Email Notification Service:** Resend API integration (`backend/email_service.py`) with dynamic user email delivery and resilient logging fallback.
- **AI Multi-Model Dual Engine:**
  - **OpenRouter API & Google Gemini:** Neural demand forecasting and interactive RAG Copilot.
  - **Groq API Acceleration:** High-speed LLM inference (`openai/gpt-oss-120b`).
- **Payment Processing:** Razorpay Enterprise Test Gateway in Indian Rupees (`₹ INR`).

---

## 🔑 Environment Variables Reference

Create a `.env` file in the root directory:

```env
# Application Server
PORT=8000
ENVIRONMENT=production

# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=alerts@supplychain.ai

# Cloud Database (Supabase)
SUPABASE_URL=https://jqkgavoculcubjqwgsrae.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# AI & LLM Inference Engines
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- Python 3.10+
- Modern Web Browser (Chrome, Safari, Firefox, Edge)

### Setup Instructions
```bash
# 1. Clone repository
git clone https://github.com/vuser02454/hackathon_supplychain.git
cd hackathon_supplychain

# 2. Set up virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start Enterprise Server
python main.py
```

Open your browser at: **`http://localhost:8000`**

---

## 📁 Directory Structure

```
├── main.py                                            # Unified application launcher (FastAPI / Uvicorn)
├── supplychain.js                                     # Central client engine (State, Modals, AI Decision Matrix, Alerts, Toast)
├── global_supply_map.jpg                              # Telemetry visual asset & global map
├── vercel.json                                        # Vercel Deployment & Routing Configuration
├── render.yaml                                        # Render Cloud Blueprint Configuration
├── index.html                                         # 🔐 Authentication Portal
├── dashboard.html                                     # 📊 Executive Dashboard & Closed-Loop Pipeline Widget
---

## 🌍 Problem Statement 7: Resilience & Sustainability in Global Supply Chains

SupplyChain.AI is explicitly architected to address the **5 critical challenges** outlined in Problem Statement 7:

```
┌────────────────────────────────────────────────────────────────────────────────┐
│             PROBLEM STATEMENT 7: RESILIENCE & SUSTAINABILITY ENGINE            │
├───────────────────────────────┬────────────────────────────────────────────────┤
│ CHALLENGE                     │ SUPPLYCHAIN.AI ARCHITECTURAL SOLUTION          │
├───────────────────────────────┼────────────────────────────────────────────────┤
│ 1. SPoF Supplier Dependency   │ Single-point-of-failure alert (>70% exposure)  │
│                               │ and automated dual-sourcing splits (60/40).    │
│ 2. Hidden Carbon Footprint    │ Transport emission calculation per freight     │
│                               │ mode (Road, Rail, Ocean, Air) & green rankings.│
│ 3. Counterfeit Product Risk   │ 5-point batch verification ledger, chain-of-   │
│                               │ custody tracking, Authenticity Score (0-100).  │
│ 4. Poor SME Visibility        │ SME Opportunity Score (84/100) and fair neural │
│                               │ capacity weighting in the utility matrix.      │
│ 5. Waste & Perishables        │ Shelf-life vs stockout throttling, expiry alert│
│                               │ engine, and safety buffer optimization.        │
└───────────────────────────────┴────────────────────────────────────────────────┘
```

### 🧠 8-Factor Sourcing Utility Matrix

The AI recommendation engine (`backend/ai_service.py`) scores candidate suppliers across 8 balanced dimensions:

$$\text{Composite Score} = \text{Cost (18)} + \text{Speed (21)} + \text{OTIF (22)} + \text{Defect (17)} + \text{Stockout (20)} + \text{Carbon (8)} + \text{Diversify (7)} + \text{Auth (5)}$$

- **Carbon Footprint Model:** Calculated as $\text{CO}_2 = \text{distance\_km} \times \frac{\text{weight\_kg}}{1000} \times \text{emission\_factor}$
  - `Air`: $0.500\text{ kg CO}_2/\text{tonne-km}$
  - `Road`: $0.105\text{ kg CO}_2/\text{tonne-km}$
  - `Rail`: $0.028\text{ kg CO}_2/\text{tonne-km}$
  - `Ocean`: $0.015\text{ kg CO}_2/\text{tonne-km}$
- **Resilience Index:** Baseline 94 adjusted by concentration penalties for high-risk single-point dependencies.
- **Perishable Waste Classification:** Expiry date tracking with `<3d` (Critical), `<7d` (Expiring Soon), and `Safety Overstock` (Waste Risk).

---

## 📁 Project Architecture & File Organization

```
├── index.html                                          # 🔐 Authentication Portal (Passkey SSO & Biometrics)
├── dashboard.html                                      # 📊 Executive Dashboard (PS7 Banner & Closed-Loop)
├── profile.html                                       # 👤 Executive Profile & Settings
├── inventory.html                                     # 📦 Inventory Intelligence & Perishables (₹ INR)
├── orders.html                                         # 🚚 Freight Logistics & Orders
├── suppliers.html                                     # 🏭 Supplier Performance, Tiers & Scorecards
├── ai-insights.html                                   # 🤖 AI Demand Forecasting & Vendor Switching
├── restock-approval.html                              # ✍️ Restock Purchase Authorization Desk
├── payments.html                                      # 💳 B2B Payment Gateway & Smart Escrow (₹ INR)
├── supplychain.js                                     # ⚡ Unified Client Architecture & Reactive Engine
├── backend/
│   ├── main.py                                        # FastAPI Application & Static Asset Routing
│   ├── models.py                                      # SQLAlchemy Models (Suppliers, Inventory, Traceability)
│   ├── schemas.py                                     # Pydantic Schemas & Decision Matrix Definitions
│   ├── database.py                                    # Database Engine & Session Provider
│   ├── seed_data.py                                   # Database Initialization & SQLite Migrations
│   ├── email_service.py                               # Resend Email Integration (Dynamic User Recipient)
│   ├── ai_service.py                                  # 8-Factor Sourcing Utility Function & Explainability
│   ├── supabase_service.py                            # Supabase Cloud Database Client
│   └── routers/
│       ├── auth.py                                    # Authentication & Passkey SSO
│       ├── orders.py                                  # Freight Lifecycle, Advancement & Delivery Outcome
│       ├── inventory.py                               # Stockout Alerts, Waste Risk & Sourcing Matrix
│       ├── suppliers.py                               # Supplier Scorecards, Tiers & SME Pipeline
│       ├── approvals.py                               # Purchase Order Authorization
│       ├── payments.py                                # Razorpay Signature Verification & Escrow
│       ├── resilience.py                              # [PS7] Resilience Score & SPoF Dependencies
│       ├── sustainability.py                          # [PS7] Carbon Calculations & Green Rankings
│       ├── traceability.py                            # [PS7] Batch Authenticity & Custody Ledger
│       └── ai.py                                      # Copilot LLM & Demand Forecast Engine
```

---

## 🌐 Available Application URLs & Endpoints

| Resource | URL / Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Authentication Portal** | `/` | GET | Enterprise login portal & biometrics |
| **Executive Dashboard** | `/dashboard` | GET | Command dashboard with PS7 5-Pillar Banner |
| **Profile & Settings** | `/profile` | GET | Executive profile, photo, phone, & Supabase sync |
| **Inventory Intelligence**| `/inventory` | GET | Stock & perishable management in ₹ INR |
| **Freight Tracking** | `/orders` | GET | Live shipment tracking & milestone timeline |
| **Supplier Scorecards** | `/suppliers` | GET | Tier 1/2/3 ratings, SME scores & carbon ranks |
| **AI Demand Forecasting**| `/ai-insights` | GET | Neural profit/loss forecast & vendor arbitrage |
| **Restock Approvals** | `/restock-approval` | GET | Purchase order authorization desk |
| **Payment Gateway** | `/payments` | GET | B2B payment & escrow portal in ₹ INR |
| **Resilience Score** | `/api/resilience/score` | GET | Overall resilience index, SPoF risk, & deep tier visibility |
| **Supplier Dependencies** | `/api/resilience/dependencies` | GET | SPoF concentration analysis & dual-sourcing splits |
| **Sustainability Summary** | `/api/sustainability/summary` | GET | Network-wide carbon footprint & mode breakdown |
| **Supplier Carbon Ranks** | `/api/sustainability/suppliers` | GET | Supplier transport modes, distance, & green ranking |
| **Tier-2+ Visibility** | `/api/suppliers/tier-visibility` | GET | Multi-tier supply network transparency (Tier 1/2/3) |
| **SME Supplier Pipeline** | `/api/suppliers/sme-opportunities` | GET | Fair procurement opportunities for small businesses |
| **Perishable Waste Risk** | `/api/inventory/waste-risk` | GET | Shelf-life tracking, expiry risks & spoilage reduction |
| **Batch Traceability** | `/api/traceability/{sku}` | GET | 5-point verification ledger & chain-of-custody audit |
| **AI Restock Proposal & Matrix** | `/api/inventory/{sku}/restock-recommendation` | POST | 8-factor decision matrix with carbon & diversification |
| **Closed-Loop Workflow State** | `/api/inventory/closed-loop-state` | GET | Dashboard executive metrics & KPI counters |
| **Advance Shipment Stage** | `/api/orders/{order_id}/advance-status` | POST | Moves status (Created → In-Transit → Delivered) |
| **Complete Delivery & Learning** | `/api/orders/{order_id}/complete-delivery` | POST | Records outcome, updates supplier score (+5 pts), resolves alerts |
| **Verify Razorpay Payment** | `/api/payments/verify` | POST | Verifies HMAC, transitions PO to PAID, spawns shipment |
| **Interactive API Docs** | `/docs` | GET | Swagger UI for all backend endpoints |

---

## 🛡️ License & Copyright

© 2026 SupplyChain.AI Enterprise Platform. All rights reserved.
