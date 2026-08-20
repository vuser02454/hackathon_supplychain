from fastapi import APIRouter
from typing import Optional, Dict, Any
from pydantic import BaseModel

from backend.ai_service import ai_service
from backend.schemas import CopilotQueryRequest, CopilotQueryResponse

router = APIRouter(prefix="/api/ai", tags=["AI Copilot & Multi-Model Intelligence"])

class ForecastAnalysisRequest(BaseModel):
    sku_data: Optional[Dict[str, Any]] = None

class RestockQuoteRequest(BaseModel):
    po_data: Dict[str, Any]

class SupplierRiskRequest(BaseModel):
    supplier_data: Dict[str, Any]

class DisruptionMitigationRequest(BaseModel):
    route_data: Dict[str, Any]

# 1. Chatbot Copilot Endpoint (Exclusively Google Gemini API)
@router.post("/copilot", response_model=CopilotQueryResponse)
def query_ai_copilot(req: CopilotQueryRequest):
    """Chatbot Copilot powered by Google Gemini API (gemini-2.5-flash)."""
    result = ai_service.query_copilot(req.prompt, req.context)
    return CopilotQueryResponse(
        response=result["response"],
        confidence=result.get("confidence", 0.99),
        suggested_actions=result.get("suggested_actions", [])
    )

# 2. Demand Forecasting & Predictive Analytics (Powered by Groq API)
@router.post("/forecast-analysis")
def get_forecast_analysis(req: ForecastAnalysisRequest):
    """Predictive Demand & Inventory Forecasting powered by Groq API."""
    return ai_service.generate_forecast_analysis(req.sku_data)

# 3. Restock Quote Arbitrage & Optimization (Powered by Groq API)
@router.post("/restock-quote-analysis")
def get_restock_quote_analysis(req: RestockQuoteRequest):
    """Restock Quote Reasoning & Pricing Arbitrage powered by Groq API."""
    return ai_service.evaluate_restock_quotes(req.po_data)

# 4. Supplier Risk & Scorecard Analysis (Powered by Groq API)
@router.post("/supplier-risk")
def get_supplier_risk_analysis(req: SupplierRiskRequest):
    """Vendor SLA & Defect Risk Analytics powered by Groq API."""
    return ai_service.analyze_supplier_risk(req.supplier_data)

# 5. Disruption Mitigation & Route Optimization (Powered by Groq API)
@router.post("/disruption-mitigation")
def get_disruption_mitigation(req: DisruptionMitigationRequest):
    """Freight Anomaly & Transit Expediting Intelligence powered by Groq API."""
    return ai_service.analyze_disruptions(req.route_data)
