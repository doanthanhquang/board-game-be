/**
 * Achievement Routes
 * Defines routes for achievement endpoints
 */

import express from 'express';
import {
  getAchievements,
  getAchievementById,
  getUserAchievements,
  checkAndUnlockAchievements,
} from '../controllers/achievementController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/achievements
 * List all achievements with user unlock status
 */
router.get('/', authenticate, getAchievements);

/**
 * GET /api/achievements/user
 * Get user's unlocked achievements
 */
router.get('/user', authenticate, getUserAchievements);

/**
 * GET /api/achievements/:id
 * Get achievement details
 */
router.get('/:id', authenticate, getAchievementById);

/**
 * POST /api/achievements/check
 * Check and unlock achievements (internal/automatic)
 */
router.post('/check', authenticate, checkAndUnlockAchievements);

export default router;
