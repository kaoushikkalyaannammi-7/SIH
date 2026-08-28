import express from 'express';
import { calculateProfit } from '../controllers/profitController.js';

const router = express.Router();

router.post('/calculate', calculateProfit);

export default router;
