import express from 'express';
import { createOffer, getOffers, seedOffers } from '../controllers/offerController.js';

const router = express.Router();

router.post('/', createOffer);
router.get('/', getOffers);
router.post('/seed', seedOffers);

export default router;
