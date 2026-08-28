import { Offer } from '../models/Offer.js';

export const createOffer = async (req, res) => {
  try {
    const { buyerName, buyerType, crop, pricePerQuintal, location, distanceKm } = req.body;
    
    const offer = new Offer({
      buyerName,
      buyerType,
      crop,
      pricePerQuintal,
      location,
      distanceKm: distanceKm || Math.floor(Math.random() * 50) + 5 // random distance 5-55km if not provided
    });
    
    await offer.save();
    res.status(201).json(offer);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: 'Failed to create offer' });
  }
};

export const getOffers = async (req, res) => {
  try {
    const { buyerType, crop } = req.query;
    let filter = {};
    if (buyerType) filter.buyerType = buyerType;
    if (crop) filter.crop = crop;
    
    const offers = await Offer.find(filter).sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
};

// Seeding function for demo
export const seedOffers = async (req, res) => {
  try {
    await Offer.deleteMany({});
    
    const dummyOffers = [
      { buyerName: 'Sharma Traders', buyerType: 'vendor', crop: 'Rice', pricePerQuintal: 2450, location: 'Pune', distanceKm: 12 },
      { buyerName: 'Kumar Trading', buyerType: 'middleman', crop: 'Rice', pricePerQuintal: 2200, location: 'Shirur', distanceKm: 5 },
      { buyerName: 'AgriCorp', buyerType: 'vendor', crop: 'Wheat', pricePerQuintal: 2250, location: 'Pune', distanceKm: 15 },
      { buyerName: 'Local Mandi', buyerType: 'mandi', crop: 'Rice', pricePerQuintal: 2150, location: 'Market Yard', distanceKm: 20 }, // mandi acts as baseline
    ];
    
    await Offer.insertMany(dummyOffers);
    res.json({ message: 'Database seeded with dummy offers' });
  } catch (error) {
    console.error('Error seeding offers:', error);
    res.status(500).json({ error: 'Failed to seed offers' });
  }
};
