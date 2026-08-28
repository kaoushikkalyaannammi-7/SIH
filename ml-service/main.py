from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
import uvicorn
from predict import predict_yield, cat_features
from explain import explain_prediction
import json
import logging
import joblib
import os

app = FastAPI(title="Agri ML Service")

# Load candidate crops dynamically from the preprocessor/cat_features
# It's better to load the unique crops from the dataset
data_path = os.path.join(os.path.dirname(__file__), "../data/training_ready_dataset.csv")
try:
    import pandas as pd
    df = pd.read_csv(data_path, low_memory=False)
    candidate_crops = df['Crop'].dropna().unique().tolist()
except:
    candidate_crops = ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane"]

class PredictionRequest(BaseModel):
    crop: Optional[str] = None
    state: str
    district: str
    season: str
    area_acres: Optional[float] = 1.0
    soil_nitrogen: Optional[float] = None
    soil_phosphorus: Optional[float] = None
    soil_potassium: Optional[float] = None
    soil_organic_carbon: Optional[float] = None
    soil_ph: Optional[float] = None
    soil_type: Optional[str] = "missing"
    agro_climatic_zone: Optional[str] = "missing"

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ml-service"}

@app.post("/predict")
def predict(req: PredictionRequest):
    try:
        crops_to_predict = [req.crop] if req.crop else candidate_crops[:5] # Predict top 5 if none specified
        
        results = []
        for c in crops_to_predict:
            input_dict = {
                'State': req.state,
                'District': req.district,
                'Crop': c,
                'Season': req.season,
                'SOIL_Nitrogen_kg_per_ha': req.soil_nitrogen,
                'SOIL_Phosphorus_kg_per_ha': req.soil_phosphorus,
                'SOIL_Potassium_kg_per_ha': req.soil_potassium,
                'SOIL_Organic_Carbon_percent': req.soil_organic_carbon,
                'SOIL_pH': req.soil_ph,
                'SOIL_Dominant_Soil_Type': req.soil_type,
                'SOIL_Agro_Climatic_Zone': req.agro_climatic_zone
            }
            
            expected, lower, upper, X_processed, df = predict_yield(input_dict)
            
            spread = upper - lower
            margin = spread / max(abs(expected), 0.0001)
            
            if margin < 0.20:
                confidence = "HIGH"
            elif margin < 0.50:
                confidence = "MEDIUM"
            else:
                confidence = "LOW"
                
            results.append({
                "crop": c,
                "expected_yield": round(expected, 2),
                "lower_bound": round(lower, 2),
                "upper_bound": round(upper, 2),
                "confidence": confidence,
                "unit": "Kg per ha"
            })
            
        if req.crop:
            return results[0]
        else:
            return {"predictions": results}
            
    except Exception as e:
        logging.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/explain")
def explain(req: PredictionRequest):
    try:
        input_dict = {
            'State': req.state,
            'District': req.district,
            'Crop': req.crop,
            'Season': req.season,
            'SOIL_Nitrogen_kg_per_ha': req.soil_nitrogen,
            'SOIL_Phosphorus_kg_per_ha': req.soil_phosphorus,
            'SOIL_Potassium_kg_per_ha': req.soil_potassium,
            'SOIL_Organic_Carbon_percent': req.soil_organic_carbon,
            'SOIL_pH': req.soil_ph,
            'SOIL_Dominant_Soil_Type': req.soil_type,
            'SOIL_Agro_Climatic_Zone': req.agro_climatic_zone
        }
        
        _, _, _, X_processed, df = predict_yield(input_dict)
        contributions = explain_prediction(X_processed)
        
        positive = [c['feature'] for c in contributions if c['direction'] == 'positive']
        negative = [c['feature'] for c in contributions if c['direction'] == 'negative']
        
        return {
            "factors": {
                "positive": positive,
                "negative": negative
            }
        }
    except Exception as e:
        logging.exception("Explanation failed")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
