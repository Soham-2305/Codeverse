from dotenv import load_dotenv
import os

load_dotenv()

APP_NAME = "Fraud ML Prediction Service"
MODEL_PATH = "app/ml/artifacts/fraud_model.pkl"
SCALER_PATH = "app/ml/artifacts/scaler.pkl"
FEATURES_PATH = "app/ml/artifacts/features.pkl"
