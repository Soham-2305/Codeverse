import numpy as np
import joblib

class FraudModel:
    def __init__(self):
        self.model = joblib.load("app/ml/artifacts/fraud_model.pkl")
        self.scaler = joblib.load("app/ml/artifacts/scaler.pkl")
        self.features = joblib.load("app/ml/artifacts/features.pkl")

    def predict(self, data: dict):
        X = np.array([[data[f] for f in self.features]])
        X = self.scaler.transform(X)
        prob = self.model.predict_proba(X)[0][1]
        return float(prob)
