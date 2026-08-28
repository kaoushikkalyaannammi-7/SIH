import pandas as pd
import numpy as np
import joblib
import os
import shap

# Load artifacts globally
current_dir = os.path.dirname(__file__)
preprocessor = joblib.load(os.path.join(current_dir, 'models/preprocessor.joblib'))
model_expected = joblib.load(os.path.join(current_dir, 'models/model_expected.joblib'))
model_lower = joblib.load(os.path.join(current_dir, 'models/model_lower.joblib'))
model_upper = joblib.load(os.path.join(current_dir, 'models/model_upper.joblib'))
cat_features = joblib.load(os.path.join(current_dir, 'models/cat_features.joblib'))
num_features = joblib.load(os.path.join(current_dir, 'models/num_features.joblib'))

def predict_yield(input_dict):
    """
    Given a dictionary of feature values, predict expected yield, lower bound, upper bound.
    """
    df = pd.DataFrame([input_dict])
    
    # Ensure all expected columns are present
    for col in cat_features + num_features:
        if col not in df.columns:
            df[col] = np.nan if col in num_features else 'missing'
    
    # Select only required columns
    df = df[cat_features + num_features]
    
    X_processed = preprocessor.transform(df)
    
    expected = float(model_expected.predict(X_processed)[0])
    lower = float(model_lower.predict(X_processed)[0])
    upper = float(model_upper.predict(X_processed)[0])
    
    # Handle quantile crossing safely
    if lower > upper:
        lower, upper = upper, lower
        
    expected = max(expected, 0.0)
    lower = max(lower, 0.0)
    upper = max(upper, 0.0)
    
    return expected, lower, upper, X_processed, df
