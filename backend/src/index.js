import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';
import mlRoutes from './routes/ml.js';
import rotationRoutes from './routes/rotation.js';
import offerRoutes from './routes/offers.js';
import profitRoutes from './routes/profit.js';
import llmRoutes from './routes/llm.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
} else {
  console.log('No MONGODB_URI provided, starting mongodb-memory-server...');
  const startMemoryDb = async () => {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('Connected to In-Memory MongoDB');
  };
  startMemoryDb();
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/rotation', rotationRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/profit', profitRoutes);
app.use('/api/llm', llmRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
