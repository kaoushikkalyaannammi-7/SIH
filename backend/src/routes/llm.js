import express from 'express';
import { generateVoiceResponse } from '../controllers/llmController.js';

const router = express.Router();

router.post('/voice', generateVoiceResponse);

export default router;
