import express from 'express';
import { getPredictions, getExplanation } from '../controllers/mlController.js';

const router = express.Router();

router.post('/predict', getPredictions);
router.post('/explain', getExplanation);

export default router;
