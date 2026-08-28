import { Offer } from '../models/Offer.js';

export const calculateProfit = async (req, res) => {
  try {
    const { crop, expectedYieldTonnesPerHa, areaAcres } = req.body;
    
    // Default values if not provided
    const yieldTonnes = expectedYieldTonnesPerHa || 3.6;
    const area = areaAcres || 1; 
    
    // 1 Tonne = 10 Quintals
    const totalYieldQuintals = (yieldTonnes * 10) * (area / 2.471); // convert ha to acres approx

    // Fetch live offers for this crop
    const offers = await Offer.find({ crop });

    // Mock Input Cost per acre
    const inputCosts = {
      'Rice': 15000,
      'Wheat': 12000,
      'Maize': 10000,
      'Mustard': 8000
    };
    
    const inputCost = (inputCosts[crop] || 10000) * area;

    const results = offers.map(offer => {
      // Transport cost estimation: 5 Rs per quintal per km
      const transportCost = offer.distanceKm * 5 * totalYieldQuintals;
      const revenue = offer.pricePerQuintal * totalYieldQuintals;
      const netProfit = revenue - inputCost - transportCost;
      
      return {
        channel: offer.buyerType,
        buyerName: offer.buyerName,
        pricePerQuintal: offer.pricePerQuintal,
        distanceKm: offer.distanceKm,
        totalYieldQuintals: Math.round(totalYieldQuintals),
        revenue: Math.round(revenue),
        inputCost: Math.round(inputCost),
        transportCost: Math.round(transportCost),
        netProfit: Math.round(netProfit)
      };
    });

    // Sort by highest profit
    results.sort((a, b) => b.netProfit - a.netProfit);

    res.json(results);
  } catch (error) {
    console.error('Profit calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate profit' });
  }
};
