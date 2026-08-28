// Simulated Data Controller

export const getWeatherData = async (req, res) => {
  const { state, district, village } = req.query;
  
  // In a real app, you would call OpenWeatherMap or IMD API here using lat/lng
  // For demo, we simulate a response based on the location.
  
  res.json({
    current: {
      temp: 28,
      humidity: 65,
      rainfall: 0,
      description: 'Partly Cloudy'
    },
    forecast: {
      summary: 'Rainfall is expected to be below normal during the upcoming flowering period.',
      alerts: []
    }
  });
};

export const getSoilData = async (req, res) => {
  const { state, district, village } = req.query;
  
  // Simulate soil data retrieval
  res.json({
    type: 'Black Cotton Soil',
    ph: 7.2,
    nitrogen: 'Low',
    phosphorus: 'Medium',
    potassium: 'High',
    organic_carbon: '0.5%',
    note: 'Estimated from available district-level soil data'
  });
};
