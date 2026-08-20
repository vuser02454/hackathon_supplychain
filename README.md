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
AI RECOMMENDATION & EXPLAINABILITY (Explicit Points Breakdown: Cost +18, Speed +24, OTIF +22, Defect +17, Stockout +20)
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

## 🌟 Functional Modules & Core Features

### 1. 🚨 Low Stock Alerts & Dynamic User Email Notification System (`/api/inventory/alerts`)
- **Continuous Threshold Evaluation:** Automatically monitors inventory records, classifying items into `NORMAL`, `LOW` (below safety stock), and `CRITICAL` (below 50% safety stock).
- **Dynamic Logged-In User Routing:** Automatically sends notification emails directly to the **active logged-in user's email address** (or the email saved in Profile & Settings). No hardcoded emails.
- **Duplicate Prevention Engine:** Deduplicates open alerts per `organization_id + sku + severity` to eliminate redundant email spamming.
- **Production Email Service (`backend/email_service.py`):** Dispatches dark-themed HTML & plain-text alert emails via **Resend API** with graceful fallback logging.
- **Top Navigation Bell & Alert Center:** Live pulsating badge count on the topbar bell with slide-over drawer displaying alert telemetry, email dispatch status, and 1-click AI restock reviews.
- **Automated Resolution:** Open alerts are automatically resolved when inventory is replenished above safety thresholds.

### 2. 🧠 AI Multi-Supplier Decision Matrix & Explainability
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

## 📁 Directory Structure

```
├── main.py                                            # Unified application launcher (FastAPI / Uvicorn)
├── supplychain.js                                     # Central client engine (State, Modals, AI Decision Matrix, Alerts, Toast)
├── global_supply_map.jpg                              # Telemetry visual asset & global map
├── vercel.json                                        # Vercel Deployment & Routing Configuration
├── render.yaml                                        # Render Cloud Blueprint Configuration
├── index.html                                         # 🔐 Authentication Portal
├── dashboard.html                                     # 📊 Executive Dashboard & Closed-Loop Pipeline Widget
├── profile.html                                       # 👤 Executive Profile & Settings
├── inventory.html                                     # 📦 Inventory Intelligence (₹ INR)
├── orders.html                                         # 🚚 Freight Logistics & Orders
├── suppliers.html                                     # 🏭 Supplier Performance & Scorecards
├── ai-insights.html                                   # 🤖 AI Demand Forecasting & Vendor Switching
├── restock-approval.html                              # ✍️ Restock Purchase Authorization Desk
├── payments.html                                      # 💳 B2B Payment Gateway & Smart Escrow (₹ INR)
├── backend/
│   ├── main.py                                        # FastAPI Application & Static Asset Routing
│   ├── models.py                                      # SQLAlchemy Database Models (SPH, Alerts, Orders, POs, Users)
│   ├── schemas.py                                     # Pydantic Schemas & Decision Matrix Definitions
│   ├── database.py                                    # Database Engine & Session Provider
│   ├── seed_data.py                                   # Database Initialization & SQLite Migrations
│   ├── email_service.py                               # Resend Email Integration (Dynamic User Recipient)
│   ├── ai_service.py                                  # Supply Chain Neural Utility Function & Decision Matrix
│   ├── supabase_service.py                            # Supabase Cloud Database Client
│   └── routers/
│       ├── auth.py                                    # Authentication & Passkey SSO
│       ├── orders.py                                  # Freight Lifecycle, Advancement & Delivery Outcome
│       ├── inventory.py                               # Threshold Scanning, Alerts, & Sourcing Matrix
│       ├── suppliers.py                               # Supplier Scorecards & Performance History
│       ├── approvals.py                               # Purchase Order Authorization
│       ├── payments.py                                # Razorpay Signature Verification & Escrow
│       └── ai.py                                      # Copilot LLM & Demand Forecast Engine
```

---

## 🌐 Available Application URLs & Endpoints

| Resource | URL / Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Authentication Portal** | `/` | GET | Enterprise login portal & biometrics |
| **Executive Dashboard** | `/dashboard` | GET | Central command dashboard & Closed-Loop widget |
| **Profile & Settings** | `/profile` | GET | Executive profile, photo, phone, & Supabase sync |
| **Inventory Intelligence**| `/inventory` | GET | Stock & warehouse management in ₹ INR |
| **Freight Tracking** | `/orders` | GET | Live shipment tracking & milestone timeline |
| **Supplier Scorecards** | `/suppliers` | GET | Vendor ratings, OTIF, & dynamic trust metrics |
| **AI Demand Forecasting**| `/ai-insights` | GET | Neural profit/loss forecast & vendor arbitrage |
| **Restock Approvals** | `/restock-approval` | GET | Purchase order authorization desk |
| **Payment Gateway** | `/payments` | GET | B2B payment & escrow portal in ₹ INR |
| **Scan Inventory Thresholds**| `/api/inventory/check-stock` | POST | Evaluates thresholds & routes emails to active user |
| **Unread Alerts Summary** | `/api/inventory/alerts/unread` | GET | Unread count & severity summary for topbar bell |
| **Inventory Alerts Roster** | `/api/inventory/alerts` | GET | Full alert history with resolved filters |
| **AI Restock Proposal & Matrix** | `/api/inventory/{sku}/restock-recommendation` | POST | Multi-vendor decision matrix & factor points |
| **Closed-Loop Workflow State** | `/api/inventory/closed-loop-state` | GET | Dashboard executive metrics & KPI counters |
| **Advance Shipment Stage** | `/api/orders/{order_id}/advance-status` | POST | Moves status (Created → In-Transit → Delivered) |
| **Complete Delivery & Learning** | `/api/orders/{order_id}/complete-delivery` | POST | Records outcome, updates supplier score (+7 pts), resolves alerts |
| **Supplier Scorecards** | `/api/suppliers/scorecards` | GET | Live scorecards with dynamic trust score deltas |
| **Supplier Performance History**| `/api/suppliers/{id}/history` | GET | Historical delivery fulfillment outcome records |
| **Verify Razorpay Payment** | `/api/payments/verify` | POST | Verifies HMAC, transitions PO to PAID, spawns shipment |
| **Interactive API Docs** | `/docs` | GET | Swagger UI for all backend endpoints |

---

## 🛡️ License & Copyright

© 2026 SupplyChain.AI Enterprise Platform. All rights reserved.
