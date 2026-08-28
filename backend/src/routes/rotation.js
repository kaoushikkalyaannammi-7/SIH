import express from 'express';
import { getRotationRecommendations } from '../controllers/rotationController.js';

const router = express.Router();

router.get('/', getRotationRecommendations);

export default router;
