# app/models/alert.py
from datetime import datetime
from typing import List
from pydantic import BaseModel, Field
from bson import ObjectId

class Alert(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    transactionId: str
    severity: str  # HIGH, MEDIUM, LOW
    riskScore: float
    reasons: List[str]
    status: str = "pending"  # pending, reviewed, dismissed
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    reviewedAt: datetime | None = None
    reviewedBy: str | None = None
    
    class Config:
        populate_by_name = True