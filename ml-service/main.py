from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI()

class PredictionRequest(BaseModel):
    state: str
    district: str
    temperature: float
    rainfall: float
    ph: float
    nitrogen: str
    phosphorus: str
    potassium: str

@app.post("/predict")
def predict_yield(req: PredictionRequest):
    # Dummy mock predictions for crops based on the requirement
    # "The ML model must output: expected yield, lower bound, upper bound, confidence"
    
    # We will simulate predictions for Rice, Maize, Wheat, Mustard
    crops = ["Rice", "Maize", "Wheat", "Mustard"]
    
    predictions = []
    for crop in crops:
        base_yield = random.uniform(1.5, 4.5)
        
        # Add some variation based on crop type just for realism
        if crop == "Rice" and req.rainfall > 50:
            base_yield += 0.5
            
        lower_bound = base_yield * 0.85
        upper_bound = base_yield * 1.15
        
        predictions.append({
            "crop": crop,
            "expected_yield": round(base_yield, 2),
            "lower_bound": round(lower_bound, 2),
            "upper_bound": round(upper_bound, 2),
            "confidence": random.choice(["HIGH", "MEDIUM", "LOW"])
        })
        
    return {"predictions": predictions}

@app.post("/explain")
def explain_prediction(req: PredictionRequest):
    # Dummy SHAP-like feature importance explanation
    # Positive and negative factors
    return {
        "crop": "Rice", # usually we'd pass the specific crop to explain
        "factors": {
            "positive": [
                "Favorable rainfall for current growth stage",
                "Suitable soil pH level (7.2)",
                "Strong historical yield in this district"
            ],
            "negative": [
                "Nitrogen level is slightly low",
                "Temperature forecast is above optimal"
            ]
        }
    }
