from pydantic import BaseModel

class PredictionResponse(BaseModel):
    fraud_probability: float
    risk_level: str
