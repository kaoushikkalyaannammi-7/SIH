import shap
import joblib
import os
import numpy as np
from predict import preprocessor, model_expected

# Initialize SHAP explainer
# We use TreeExplainer for XGBoost models
explainer = shap.TreeExplainer(model_expected)

def explain_prediction(X_processed):
    """
    Returns SHAP explanations for a single prediction.
    X_processed: The processed feature vector from preprocessor.transform()
    """
    shap_values = explainer.shap_values(X_processed)
    
    # We need to map the SHAP values back to feature names
    # Getting feature names from sklearn preprocessor can be tricky
    feature_names = []
    
    num_features = preprocessor.transformers_[0][2]
    cat_features = preprocessor.transformers_[1][2]
    
    # Num features
    feature_names.extend(num_features)
    
    # Cat features (from OneHotEncoder)
    onehot_encoder = preprocessor.transformers_[1][1].named_steps['onehot']
    cat_encoded_names = onehot_encoder.get_feature_names_out(cat_features)
    feature_names.extend(cat_encoded_names)
    
    contributions = []
    
    for i, name in enumerate(feature_names):
        impact = float(shap_values[0][i])
        if abs(impact) > 0.01: # Filter out near-zero impacts
            # Simplify feature names for display
            display_name = name
            if display_name.startswith('SOIL_'):
                display_name = display_name.replace('SOIL_', '')
            if '_' in display_name:
                display_name = display_name.replace('_', ' ')
                
            contributions.append({
                "feature": display_name,
                "impact": impact,
                "direction": "positive" if impact > 0 else "negative"
            })
            
    # Sort by absolute impact
    contributions.sort(key=lambda x: abs(x["impact"]), reverse=True)
    
    # Return top 5
    return contributions[:5]
