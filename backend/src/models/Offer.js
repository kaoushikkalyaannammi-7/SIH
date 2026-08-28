import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  buyerName: { type: String, required: true },
  buyerType: { type: String, enum: ['vendor', 'middleman', 'mandi'], required: true },
  crop: { type: String, required: true },
  pricePerQuintal: { type: Number, required: true },
  location: { type: String, required: true }, // e.g. "Pune, Maharashtra"
  distanceKm: { type: Number, default: 15 }, // mock distance for transport calculation
}, { timestamps: true });

export const Offer = mongoose.model('Offer', offerSchema);
