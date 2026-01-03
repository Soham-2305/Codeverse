# app/routers/predict.py
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.request import PredictionRequest
from app.schemas.response import PredictionResponse
from app.ml.model import FraudModel
from app.services.alert_service import AlertService
from typing import Dict

router = APIRouter()
model = FraudModel()
alert_service = AlertService()

def get_fraud_reasons(probability: float, data: dict) -> list[str]:
    """Analyze transaction data to determine fraud indicators"""
    reasons = []
    
    # Amount-based checks
    if data.get("amount", 0) > 10000:
        reasons.append("High transaction amount")
    
    # Velocity checks
    if data.get("transactions_last_hour", 0) > 5:
        reasons.append("Multiple transactions in short period")
    
    # Location checks
    if data.get("location_mismatch", False):
        reasons.append("Unusual location")
    
    # Device checks
    if data.get("new_device", False):
        reasons.append("New device detected")
    
    # Time-based checks
    if data.get("unusual_time", False):
        reasons.append("Transaction at unusual time")
    
    # Merchant checks
    if data.get("high_risk_merchant", False):
        reasons.append("High-risk merchant category")
    
    # ML confidence
    if probability > 0.85:
        reasons.append("High ML model confidence")
    
    return reasons if reasons else ["Anomalous pattern detected"]

@router.post("/predict", response_model=PredictionResponse)
async def predict_fraud(payload: PredictionRequest):
    try:
        # Get ML prediction
        probability = model.predict(payload.dict())
        
        # Determine risk level
        if probability > 0.7:
            risk_level = "HIGH"
        elif probability > 0.4:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        # Create alert if risk is MEDIUM or HIGH
        if risk_level in ["HIGH", "MEDIUM"]:
            reasons = get_fraud_reasons(probability, payload.dict())
            
            await alert_service.create_alert(
                transaction_id=payload.dict().get("transaction_id", "unknown"),
                severity=risk_level,
                risk_score=probability,
                reasons=reasons
            )
        
        return {
            "fraud_probability": probability,
            "risk_level": risk_level
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")