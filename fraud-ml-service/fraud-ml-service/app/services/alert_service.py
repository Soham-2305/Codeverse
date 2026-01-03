# app/services/alert_service.py
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from typing import List, Optional
import os

class AlertService:
    def __init__(self):
        self.client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
        self.db = self.client[os.getenv("DB_NAME", "fraud_detection")]
        self.collection = self.db["alerts"]
    
    async def create_alert(
        self, 
        transaction_id: str, 
        severity: str, 
        risk_score: float, 
        reasons: List[str]
    ):
        """Create a new security alert"""
        alert = {
            "transactionId": transaction_id,
            "severity": severity,
            "riskScore": risk_score,
            "reasons": reasons,
            "status": "pending",
            "createdAt": datetime.utcnow(),
            "reviewedAt": None,
            "reviewedBy": None
        }
        
        result = await self.collection.insert_one(alert)
        return str(result.inserted_id)
    
    async def get_alerts(
        self, 
        limit: int = 20, 
        status: Optional[str] = None
    ):
        """Retrieve alerts with optional filtering"""
        query = {}
        if status:
            query["status"] = status
        
        cursor = self.collection.find(query).sort("createdAt", -1).limit(limit)
        alerts = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string
        for alert in alerts:
            alert["_id"] = str(alert["_id"])
        
        return alerts
    
    async def update_alert_status(
        self, 
        alert_id: str, 
        status: str, 
        reviewed_by: str
    ):
        """Update alert status after review"""
        result = await self.collection.update_one(
            {"_id": alert_id},
            {
                "$set": {
                    "status": status,
                    "reviewedAt": datetime.utcnow(),
                    "reviewedBy": reviewed_by
                }
            }
        )
        return result.modified_count > 0
    
    async def get_alert_stats(self):
        """Get alert statistics for dashboard"""
        pipeline = [
            {
                "$group": {
                    "_id": "$severity",
                    "count": {"$sum": 1}
                }
            }
        ]
        
        stats = await self.collection.aggregate(pipeline).to_list(length=None)
        return {item["_id"]: item["count"] for item in stats}