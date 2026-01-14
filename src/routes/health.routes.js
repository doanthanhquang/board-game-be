/**
 * Health Routes
 * Defines routes for health checks and API info
 */

import express from 'express';
import { getHealth, getApiInfo } from '../controllers/index.js';

const router = express.Router();

// Health check endpoint
router.get('/health', getHealth);

// API info endpoint
router.get('/api', getApiInfo);

export default router;
