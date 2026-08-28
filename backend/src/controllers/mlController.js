import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const soilDbPath = path.join(__dirname, '../data/soil_db.json');
let soilDb = {};
if (fs.existsSync(soilDbPath)) {
  soilDb = JSON.parse(fs.readFileSync(soilDbPath, 'utf8'));
}

export const getPredictions = async (req, res) => {
  try {
    const { state, district, crop, season } = req.body;
    const key = `${state}_${district}`.toUpperCase();
    const soil = soilDb[key] || {};
    
    const mlReq = {
      state: state || "missing",
      district: district || "missing",
      crop: crop,
      season: season || "Kharif", // Default
      soil_nitrogen: soil.SOIL_Nitrogen_kg_per_ha,
      soil_phosphorus: soil.SOIL_Phosphorus_kg_per_ha,
      soil_potassium: soil.SOIL_Potassium_kg_per_ha,
      soil_organic_carbon: soil.SOIL_Organic_Carbon_percent,
      soil_ph: soil.SOIL_pH,
      soil_type: soil.SOIL_Dominant_Soil_Type || "missing",
      agro_climatic_zone: soil.SOIL_Agro_Climatic_Zone || "missing"
    };

    const mlResponse = await axios.post('http://localhost:8000/predict', mlReq);
    res.json(mlResponse.data);
  } catch (error) {
    console.error('Error calling ML service', error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
};

export const getExplanation = async (req, res) => {
  try {
    const { state, district, crop, season } = req.body;
    const key = `${state}_${district}`.toUpperCase();
    const soil = soilDb[key] || {};
    
    const mlReq = {
      state: state || "missing",
      district: district || "missing",
      crop: crop,
      season: season || "Kharif",
      soil_nitrogen: soil.SOIL_Nitrogen_kg_per_ha,
      soil_phosphorus: soil.SOIL_Phosphorus_kg_per_ha,
      soil_potassium: soil.SOIL_Potassium_kg_per_ha,
      soil_organic_carbon: soil.SOIL_Organic_Carbon_percent,
      soil_ph: soil.SOIL_pH,
      soil_type: soil.SOIL_Dominant_Soil_Type || "missing",
      agro_climatic_zone: soil.SOIL_Agro_Climatic_Zone || "missing"
    };

    const mlResponse = await axios.post('http://localhost:8000/explain', mlReq);
    res.json(mlResponse.data);
  } catch (error) {
    console.error('Error calling ML service explanation', error);
    res.status(500).json({ error: 'Failed to fetch explanation' });
  }
};
