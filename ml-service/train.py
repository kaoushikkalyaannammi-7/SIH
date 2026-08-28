import pandas as pd
import numpy as np
import os
import joblib
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def clean_and_prepare_data(df):
    """
    Cleans the dataset and prepares features and target.
    """
    print("Initial shape:", df.shape)
    
    # Target variable
    target = 'Yield'
    
    # Drop rows where target is missing or <= 0
    df = df.dropna(subset=[target])
    df = df[df[target] > 0]
    
    print("Shape after dropping invalid targets:", df.shape)
    
    # Features that are safe and known at prediction time
    # We deliberately exclude Area, Production, Crop_Year, and ICRISAT columns to avoid leakage/extrapolation
    categorical_features = ['State', 'District', 'Crop', 'Season', 'SOIL_Dominant_Soil_Type', 'SOIL_Agro_Climatic_Zone']
    numeric_features = [
        'SOIL_Nitrogen_kg_per_ha', 
        'SOIL_Phosphorus_kg_per_ha', 
        'SOIL_Potassium_kg_per_ha', 
        'SOIL_Organic_Carbon_percent', 
        'SOIL_pH'
    ]
    
    # Make sure all categorical are strings
    for col in categorical_features:
        df[col] = df[col].astype(str)
        
    X = df[categorical_features + numeric_features]
    y = df[target]
    
    return X, y, categorical_features, numeric_features

def build_preprocessor(categorical_features, numeric_features):
    """
    Builds the sklearn preprocessor pipeline.
    """
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    return preprocessor

def train_models():
    data_path = os.path.join(os.path.dirname(__file__), "../data/training_ready_dataset.csv")
    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path, low_memory=False)
    
    X, y, cat_features, num_features = clean_and_prepare_data(df)
    
    # Chronological split or random split? 
    # Since we excluded Crop_Year, a random split is safer here to ensure all states/districts are represented.
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"Training set: {X_train.shape}, Test set: {X_test.shape}")
    
    preprocessor = build_preprocessor(cat_features, num_features)
    
    print("Fitting preprocessor...")
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    
    os.makedirs(os.path.join(os.path.dirname(__file__), 'models'), exist_ok=True)
    joblib.dump(preprocessor, os.path.join(os.path.dirname(__file__), 'models/preprocessor.joblib'))
    joblib.dump(cat_features, os.path.join(os.path.dirname(__file__), 'models/cat_features.joblib'))
    joblib.dump(num_features, os.path.join(os.path.dirname(__file__), 'models/num_features.joblib'))
    
    # 1. Expected Yield Model
    print("Training Expected Yield Model...")
    model_expected = XGBRegressor(
        objective='reg:squarederror',
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        random_state=42,
        n_jobs=-1
    )
    model_expected.fit(X_train_processed, y_train)
    
    # Evaluate Expected Model
    y_pred = model_expected.predict(X_test_processed)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    print(f"Expected Model - MAE: {mae:.4f}, RMSE: {rmse:.4f}, R2: {r2:.4f}")
    
    # Save Expected Model
    joblib.dump(model_expected, os.path.join(os.path.dirname(__file__), 'models/model_expected.joblib'))
    
    # 2. Lower Bound Model (15th percentile)
    print("Training Lower Bound Model (alpha=0.15)...")
    model_lower = XGBRegressor(
        objective='reg:quantileerror',
        quantile_alpha=0.15,
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        random_state=42,
        n_jobs=-1
    )
    model_lower.fit(X_train_processed, y_train)
    joblib.dump(model_lower, os.path.join(os.path.dirname(__file__), 'models/model_lower.joblib'))
    
    # 3. Upper Bound Model (85th percentile)
    print("Training Upper Bound Model (alpha=0.85)...")
    model_upper = XGBRegressor(
        objective='reg:quantileerror',
        quantile_alpha=0.85,
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        random_state=42,
        n_jobs=-1
    )
    model_upper.fit(X_train_processed, y_train)
    joblib.dump(model_upper, os.path.join(os.path.dirname(__file__), 'models/model_upper.joblib'))
    
    print("All models trained and saved successfully.")

if __name__ == "__main__":
    train_models()
