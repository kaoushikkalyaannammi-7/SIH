import express from 'express';
import { getWeatherData, getSoilData } from '../controllers/dataController.js';

const router = express.Router();

router.get('/weather', getWeatherData);
router.get('/soil', getSoilData);

export default router;
