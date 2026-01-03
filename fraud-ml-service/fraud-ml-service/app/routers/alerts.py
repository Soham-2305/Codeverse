# app/routers/alerts.py
from fastapi import APIRouter, HTTPException, Query
from app.services.alert_service import AlertService
from typing import Optional

router = APIRouter()
alert_service = AlertService()

@router.get("/alerts")
async def get_alerts(
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None, regex="^(pending|reviewed|dismissed)$")
):
    """Get security alerts with optional filtering"""
    try:
        alerts = await alert_service.get_alerts(limit=limit, status=status)
        return {"alerts": alerts, "count": len(alerts)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/alerts/{alert_id}")
async def update_alert(
    alert_id: str,
    status: str,
    reviewed_by: str
):
    """Update alert status after review"""
    try:
        success = await alert_service.update_alert_status(
            alert_id=alert_id,
            status=status,
            reviewed_by=reviewed_by
        )
        
        if not success:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        return {"message": "Alert updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alerts/stats")
async def get_alert_stats():
    """Get alert statistics"""
    try:
        stats = await alert_service.get_alert_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))