/**
 * Routes Module
 * Central export point for all routes
 */

import express from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import gameRoutes from './game.routes.js';

const router = express.Router();

// Mount health routes
router.use('/', healthRoutes);

// Mount authentication routes
router.use('/api/auth', authRoutes);

// Mount game routes
router.use('/api/games', gameRoutes);

// Future routes will be added here:
// router.use('/api/v1/players', playerRoutes);

export default router;
