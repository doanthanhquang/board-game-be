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
import { validateApiKey } from '../middleware/index.js';

const router = express.Router();

// Apply API key validation to all achievement routes
router.use(validateApiKey);

/**
 * @swagger
 * /api/achievements:
 *   get:
 *     summary: List all achievements
 *     description: List all achievements with user unlock status
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Achievements retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, getAchievements);

/**
 * @swagger
 * /api/achievements/user:
 *   get:
 *     summary: Get user achievements
 *     description: Get user's unlocked achievements
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: User achievements retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/user', authenticate, getUserAchievements);

/**
 * @swagger
 * /api/achievements/{id}:
 *   get:
 *     summary: Get achievement details
 *     description: Get detailed information about a specific achievement
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Achievement ID
 *     responses:
 *       200:
 *         description: Achievement details retrieved successfully
 *       404:
 *         description: Achievement not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authenticate, getAchievementById);

/**
 * @swagger
 * /api/achievements/check:
 *   post:
 *     summary: Check and unlock achievements
 *     description: Check and unlock achievements (internal/automatic)
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Achievements checked successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/check', authenticate, checkAndUnlockAchievements);

export default router;
