/**
 * Admin Routes
 * Defines routes for admin dashboard statistics endpoints
 */

import express from 'express';
import { getGameStats, getNewAccounts, getTopWinners, getTopPoints } from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { validateApiKey } from '../middleware/index.js';

const router = express.Router();

// Apply API key validation to all admin routes
router.use(validateApiKey);

// Apply authentication and admin role requirement to all routes
router.use(authenticate);
router.use(requireRole('admin'));

/**
 * @swagger
 * /api/admin/dashboard/game-stats:
 *   get:
 *     summary: Get most played games statistics (Admin only)
 *     description: Get a list of games ordered by total play count
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of games to return
 *     responses:
 *       200:
 *         description: Game statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/dashboard/game-stats', getGameStats);

/**
 * @swagger
 * /api/admin/dashboard/new-accounts:
 *   get:
 *     summary: Get recent user registrations (Admin only)
 *     description: Get a list of recently registered users
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of users to return
 *     responses:
 *       200:
 *         description: New accounts retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/dashboard/new-accounts', getNewAccounts);

/**
 * @swagger
 * /api/admin/dashboard/top-winners:
 *   get:
 *     summary: Get top winners statistics (Admin only)
 *     description: Get a list of users with the most game wins
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of users to return
 *     responses:
 *       200:
 *         description: Top winners retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/dashboard/top-winners', getTopWinners);

/**
 * @swagger
 * /api/admin/dashboard/top-points:
 *   get:
 *     summary: Get top points statistics (Admin only)
 *     description: Get a list of users with the highest total points
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of users to return
 *     responses:
 *       200:
 *         description: Top points retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/dashboard/top-points', getTopPoints);

export default router;
