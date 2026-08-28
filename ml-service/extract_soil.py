import pandas as pd
import json

df = pd.read_csv('../data/training_ready_dataset.csv', low_memory=False)

# Get first occurrence of soil data per district
soil_cols = [
    'State', 'District', 'SOIL_Dominant_Soil_Type', 'SOIL_Agro_Climatic_Zone',
    'SOIL_pH', 'SOIL_Organic_Carbon_percent', 'SOIL_Nitrogen_kg_per_ha',
    'SOIL_Phosphorus_kg_per_ha', 'SOIL_Potassium_kg_per_ha'
]

# Drop duplicates based on state and district
soil_df = df[soil_cols].drop_duplicates(subset=['State', 'District']).dropna(subset=['SOIL_Dominant_Soil_Type'])

soil_dict = {}
for _, row in soil_df.iterrows():
    key = f"{row['State']}_{row['District']}".upper()
    soil_dict[key] = {
        'SOIL_Dominant_Soil_Type': str(row['SOIL_Dominant_Soil_Type']),
        'SOIL_Agro_Climatic_Zone': str(row['SOIL_Agro_Climatic_Zone']),
        'SOIL_pH': float(row['SOIL_pH']) if pd.notnull(row['SOIL_pH']) else None,
        'SOIL_Organic_Carbon_percent': float(row['SOIL_Organic_Carbon_percent']) if pd.notnull(row['SOIL_Organic_Carbon_percent']) else None,
        'SOIL_Nitrogen_kg_per_ha': float(row['SOIL_Nitrogen_kg_per_ha']) if pd.notnull(row['SOIL_Nitrogen_kg_per_ha']) else None,
        'SOIL_Phosphorus_kg_per_ha': float(row['SOIL_Phosphorus_kg_per_ha']) if pd.notnull(row['SOIL_Phosphorus_kg_per_ha']) else None,
        'SOIL_Potassium_kg_per_ha': float(row['SOIL_Potassium_kg_per_ha']) if pd.notnull(row['SOIL_Potassium_kg_per_ha']) else None,
    }

with open('../backend/src/data/soil_db.json', 'w') as f:
    json.dump(soil_dict, f, indent=2)

print("Exported soil db to backend")
