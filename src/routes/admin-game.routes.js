/**
 * Admin Game Routes
 * Defines routes for admin game management endpoints
 */

import express from 'express';
import { listAllGames, getGameById, updateGameConfig } from '../controllers/gameController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { validateApiKey } from '../middleware/index.js';

const router = express.Router();

// Apply API key validation to all admin game routes
router.use(validateApiKey);

// Apply authentication and admin role requirement to all routes
router.use(authenticate);
router.use(requireRole('admin'));

/**
 * @swagger
 * /api/admin/games:
 *   get:
 *     summary: List all games (Admin only)
 *     description: Get a paginated list of all games including disabled ones
 *     tags: [Admin Games]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or slug
 *     responses:
 *       200:
 *         description: Games retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/', listAllGames);

/**
 * @swagger
 * /api/admin/games/{id}:
 *   get:
 *     summary: Get game by ID (Admin only)
 *     description: Get detailed information about a specific game
 *     tags: [Admin Games]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Game ID
 *     responses:
 *       200:
 *         description: Game retrieved successfully
 *       404:
 *         description: Game not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/:id', getGameById);

/**
 * @swagger
 * /api/admin/games/{id}:
 *   put:
 *     summary: Update game configuration (Admin only)
 *     description: Update game configuration (board size, time limit, enable/disable)
 *     tags: [Admin Games]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Game ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               default_board_width:
 *                 type: integer
 *                 minimum: 3
 *                 maximum: 50
 *               default_board_height:
 *                 type: integer
 *                 minimum: 3
 *                 maximum: 50
 *               default_time_limit:
 *                 type: integer
 *                 nullable: true
 *                 description: Time limit in seconds, null for no limit
 *               is_enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Game updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Game not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.put('/:id', updateGameConfig);

export default router;
