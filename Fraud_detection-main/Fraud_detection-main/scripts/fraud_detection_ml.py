import os
import json
import joblib # type: ignore
import numpy as np

# This script is a placeholder for loading and using your .pkl models
# Place your scaler.pkl and fraud_model.pkl in this directory or update paths

SCALER_PATH = os.path.join(os.path.dirname(__file__), 'scaler.pkl')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'fraud_model.pkl')

def load_models():
    """
    Loads the ML models if they exist.
    """
    if os.path.exists(SCALER_PATH) and os.path.exists(MODEL_PATH):
        try:
            scaler = joblib.load(SCALER_PATH)
            model = joblib.load(MODEL_PATH)
            return scaler, model
        except Exception as e:
            print(f"Error loading models: {e}")
            return None, None
    return None, None

def predict_fraud(transaction_data):
    """
    Predicts the likelihood of fraud for a given transaction.
    """
    scaler, model = load_models()
    
    if not model:
        # Fallback to a simple heuristic if ML model isn't available
        return {"riskScore": 0.5, "decision": "FLAG", "reasons": ["ML Model not loaded"]}
    
    try:
        # Preprocessing step (Update based on your model's expected input)
        features = np.array([
            transaction_data.get('amount', 0),
            # Add other features like encoded location, device, etc.
        ]).reshape(1, -1)
        
        scaled_features = scaler.transform(features)
        prediction = model.predict_proba(scaled_features)[0][1] # Probability of class 1 (Fraud)
        
        decision = "ALLOW"
        if prediction > 0.8:
            decision = "BLOCK"
        elif prediction > 0.4:
            decision = "FLAG"
            
        return {
            "riskScore": float(prediction),
            "decision": decision,
            "reasons": ["ML prediction analyzed behavioral features"]
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Example usage
    sample_data = {"amount": 5500, "userId": "user_123"}
    result = predict_fraud(sample_data)
    print(json.dumps(result))
