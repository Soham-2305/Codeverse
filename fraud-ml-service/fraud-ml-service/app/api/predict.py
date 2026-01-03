from fastapi import APIRouter
from app.schemas.request import PredictionRequest
from app.schemas.response import PredictionResponse
from app.ml.model import FraudModel

router = APIRouter()
model = FraudModel()

@router.post("/predict", response_model=PredictionResponse)
def predict_fraud(payload: PredictionRequest):
    probability = model.predict(payload.dict())

    risk_level = (
        "HIGH" if probability > 0.7
        else "MEDIUM" if probability > 0.4
        else "LOW"
    )

    return {
        "fraud_probability": probability,
        "risk_level": risk_level
    }
