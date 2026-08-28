import axios from 'axios';
import { Offer } from '../models/Offer.js';

export const getRecommendations = async (req, res) => {
  try {
    const { state, district, season } = req.body;
    
    // 1. Get predictions for top candidate crops
    const mlResponse = await axios.post('http://localhost:5000/api/ml/predict', {
      state, district, season
    });
    
    const predictions = mlResponse.data.predictions || [];
    
    // 2. For each crop, calculate max profit
    const recommendations = [];
    
    for (const pred of predictions) {
      const expectedYieldTonnesPerHa = pred.expected_yield;
      
      // Get all offers for this crop
      const offers = await Offer.find({ crop: pred.crop });
      
      let bestProfit = 0;
      let bestChannel = 'mandi';
      let bestBuyer = 'None';
      let totalProd = expectedYieldTonnesPerHa; // for 1 hectare = 2.47 acres
      
      if (offers.length > 0) {
        // Calculate max profit similar to profitController
        let areaAcres = 1;
        let expectedYieldQuintals = expectedYieldTonnesPerHa * 10;
        let totalYieldQuintals = expectedYieldQuintals * areaAcres;
        
        let inputCost = 15000 * areaAcres; // baseline demo cost
        
        for (const offer of offers) {
          let transportCost = offer.distanceKm * 5 * totalYieldQuintals;
          if (offer.buyerType === 'vendor') transportCost = 0; // farm gate
          
          let revenue = offer.pricePerQuintal * totalYieldQuintals;
          let netProfit = revenue - inputCost - transportCost;
          
          if (netProfit > bestProfit) {
            bestProfit = netProfit;
            bestChannel = offer.buyerType;
            bestBuyer = offer.buyerName;
          }
        }
      }
      
      recommendations.push({
        crop: pred.crop,
        yield: pred.expected_yield,
        range: `${pred.lower_bound}-${pred.upper_bound}`,
        confidence: pred.confidence,
        channel: bestChannel,
        buyer: bestBuyer,
        profit: Math.max(0, bestProfit),
        prod: expectedYieldTonnesPerHa
      });
    }
    
    // Sort by profit desc
    recommendations.sort((a, b) => b.profit - a.profit);
    
    res.json(recommendations.slice(0, 3));
    
  } catch (error) {
    console.error('Error in recommendation engine', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};
