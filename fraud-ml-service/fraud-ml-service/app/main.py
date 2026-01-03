# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import predict, alerts
from app.config import APP_NAME

app = FastAPI(title=APP_NAME)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(predict.router, prefix="/api/v1", tags=["predictions"])
app.include_router(alerts.router, prefix="/api/v1", tags=["alerts"])

@app.get("/health")
def health_check():
    return {"status": "healthy"}