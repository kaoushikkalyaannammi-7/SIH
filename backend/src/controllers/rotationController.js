export const getRotationRecommendations = (req, res) => {
  const { previousCrop } = req.query;

  // Rule-based deterministic logic
  // e.g., if previous crop is Rice (depletes Nitrogen), recommend Legumes (fixes Nitrogen)
  
  const rules = {
    'Rice': [
      {
        crop: 'Mustard',
        benefit: 'Breaks pest cycle and requires less water',
        waterReq: 'Low',
        expectedYield: '1.6 t/ha',
        expectedProfit: '₹39,800/acre',
        suitability: 'High'
      },
      {
        crop: 'Chickpea (Chana)',
        benefit: 'Legume crop, restores soil nitrogen depleted by Rice',
        waterReq: 'Low',
        expectedYield: '1.2 t/ha',
        expectedProfit: '₹42,000/acre',
        suitability: 'High'
      },
      {
        crop: 'Wheat',
        benefit: 'Standard rabi crop, good market demand',
        waterReq: 'Moderate',
        expectedYield: '3.4 t/ha',
        expectedProfit: '₹35,000/acre',
        suitability: 'Medium'
      }
    ],
    'Wheat': [
      {
        crop: 'Moong (Green Gram)',
        benefit: 'Short duration, nitrogen fixing',
        waterReq: 'Low',
        expectedYield: '0.8 t/ha',
        expectedProfit: '₹30,000/acre',
        suitability: 'High'
      }
    ]
  };

  const recommendations = rules[previousCrop] || rules['Rice']; // fallback for demo

  res.json({
    previousCrop: previousCrop || 'Rice',
    soilCondition: 'Slightly Nitrogen Depleted',
    waterAvailability: 'Moderate',
    recommendations
  });
};
