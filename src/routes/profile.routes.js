/**
 * Profile Routes
 * Defines routes for profile management endpoints
 */

import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';
import { validateApiKey } from '../middleware/index.js';

const router = express.Router();

// Apply API key validation to all profile routes
router.use(validateApiKey);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     description: Get current user's profile with game statistics
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 profile:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     gameStatistics:
 *                       type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile
 *     description: Update current user's profile information
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username
 *               bio:
 *                 type: string
 *                 description: User bio
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put('/', authenticate, updateProfile);

export default router;
