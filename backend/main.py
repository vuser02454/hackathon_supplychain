import os
import uvicorn
from dotenv import load_dotenv

# Ensure .env is loaded at backend startup
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.database import engine, Base
from backend.seed_data import init_db_and_seed
from backend.routers import auth, orders, inventory, suppliers, approvals, ai, payments, resilience, sustainability, traceability

# Initialize FastAPI App
app = FastAPI(
    title="SupplyChain.AI — Enterprise API Platform",
    description="Autonomous AI-driven Supply Chain Orchestration Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Event: Initialize and Seed SQLite Database
@app.on_event("startup")
def on_startup():
    init_db_and_seed()

# Register API Routers
app.include_router(auth.router)
app.include_router(orders.router)
app.include_router(inventory.router)
app.include_router(suppliers.router)
app.include_router(approvals.router)
app.include_router(ai.router)
app.include_router(payments.router)
app.include_router(resilience.router)
app.include_router(sustainability.router)
app.include_router(traceability.router)

# Health Check Endpoint
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "platform": "SupplyChain.AI Enterprise",
        "telemetry_nodes": 48,
        "ai_engine": "Gemini 3.1 Orchestration Active",
        "payment_gateway": "Razorpay Enterprise Active"
    }

# Static Files & Frontend Serving
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

@app.get("/")
def serve_root():
    return FileResponse(os.path.join(BASE_DIR, "index.html"))

@app.get("/dashboard")
def serve_dashboard():
    return FileResponse(os.path.join(BASE_DIR, "dashboard.html"))

@app.get("/orders")
def serve_orders():
    return FileResponse(os.path.join(BASE_DIR, "orders.html"))

@app.get("/inventory")
def serve_inventory():
    return FileResponse(os.path.join(BASE_DIR, "inventory.html"))

@app.get("/suppliers")
def serve_suppliers():
    return FileResponse(os.path.join(BASE_DIR, "suppliers.html"))

@app.get("/ai-insights")
def serve_ai_insights():
    return FileResponse(os.path.join(BASE_DIR, "ai-insights.html"))

@app.get("/restock-approval")
def serve_restock_approval():
    return FileResponse(os.path.join(BASE_DIR, "restock-approval.html"))

@app.get("/payments")
def serve_payments():
    return FileResponse(os.path.join(BASE_DIR, "payments.html"))

@app.get("/profile")
def serve_profile():
    return FileResponse(os.path.join(BASE_DIR, "profile.html"))

@app.get("/profile.html")
def serve_profile_html():
    return FileResponse(os.path.join(BASE_DIR, "profile.html"))

@app.get("/supplychain_payment_gateway.html")
def serve_payment_gateway_alias():
    return FileResponse(os.path.join(BASE_DIR, "payments.html"))


# Mount workspace directory to serve static assets (HTML, JS, JPG)
app.mount("/", StaticFiles(directory=BASE_DIR, html=True), name="static")

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
