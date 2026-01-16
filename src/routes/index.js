/**
 * Routes Module
 * Central export point for all routes
 */

import express from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import gameRoutes from './game.routes.js';
import friendRoutes from './friend.routes.js';
import profileRoutes from './profile.routes.js';
import messageRoutes from './message.routes.js';

const router = express.Router();

// Mount health routes
router.use('/', healthRoutes);

// Mount authentication routes
router.use('/api/auth', authRoutes);

// Mount game routes
router.use('/api/games', gameRoutes);

// Mount friend routes
router.use('/api/friends', friendRoutes);

// Mount profile routes
router.use('/api/profile', profileRoutes);

// Mount message routes
router.use('/api/messages', messageRoutes);

// Future routes will be added here:
// router.use('/api/v1/players', playerRoutes);

export default router;
