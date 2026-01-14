/**
 * Routes Module
 * Central export point for all routes
 */

import express from 'express';
import healthRoutes from './health.routes.js';

const router = express.Router();

// Mount health routes
router.use('/', healthRoutes);

// Future routes will be added here:
// router.use('/api/v1/games', gameRoutes);
// router.use('/api/v1/players', playerRoutes);

export default router;
