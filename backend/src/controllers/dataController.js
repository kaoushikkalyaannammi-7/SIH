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

export const getWeatherData = async (req, res) => {
  const { state, district, village } = req.query;
  
  // Real weather info logic would go here
  // For demo, we supply standard safe context data
  res.json({
    current: {
      temp: 28,
      humidity: 65,
      rainfall: 12,
      description: 'Partly Cloudy'
    },
    forecast: {
      summary: 'Normal rainfall expected for the coming weeks.',
      alerts: []
    }
  });
};

export const getSoilData = async (req, res) => {
  const { state, district, village } = req.query;
  
  const key = `${state}_${district}`.toUpperCase();
  const data = soilDb[key];
  
  if (data) {
    res.json({
      type: data.SOIL_Dominant_Soil_Type,
      ph: data.SOIL_pH,
      nitrogen: data.SOIL_Nitrogen_kg_per_ha,
      phosphorus: data.SOIL_Phosphorus_kg_per_ha,
      potassium: data.SOIL_Potassium_kg_per_ha,
      organic_carbon: data.SOIL_Organic_Carbon_percent,
      agro_climatic_zone: data.SOIL_Agro_Climatic_Zone,
      note: 'Actual regional soil data from training dataset'
    });
  } else {
    // Fallback if not found in dataset
    res.json({
      type: 'missing',
      ph: null,
      nitrogen: null,
      phosphorus: null,
      potassium: null,
      organic_carbon: null,
      agro_climatic_zone: 'missing',
      note: 'Demo fallback data (location not found)'
    });
  }
};
