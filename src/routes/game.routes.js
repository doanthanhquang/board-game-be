/**
 * Game Routes
 * Defines routes for game-related operations
 */

import express from 'express';
import {
  getGames,
  getGameBySlug,
  recordGameScore,
  getGameRanking,
  createGameRating,
  listGameRatings,
  saveGameState,
  listGameSaves,
  loadGameSave,
  clearGameSaves,
} from '../controllers/gameController.js';
import { authenticate, validateBodyNotEmpty, validateApiKey } from '../middleware/index.js';

const router = express.Router();

// Apply API key validation to all game routes
router.use(validateApiKey);

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Get all enabled games
 *     description: Retrieve a list of all enabled games
 *     tags: [Games]
 *     security:
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: List of games
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 games:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       slug:
 *                         type: string
 *                       description:
 *                         type: string
 */
router.get('/', getGames);

/**
 * @swagger
 * /api/games/{slug}:
 *   get:
 *     summary: Get game by slug
 *     description: Retrieve detailed information about a specific game
 *     tags: [Games]
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Game slug identifier
 *     responses:
 *       200:
 *         description: Game details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 game:
 *                   type: object
 *       404:
 *         description: Game not found
 */
router.get('/:slug', getGameBySlug);

/**
 * @swagger
 * /api/games/{slug}/scores:
 *   post:
 *     summary: Record game score
 *     description: Record score for a completed game (winner only)
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Game slug identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *             properties:
 *               score:
 *                 type: number
 *                 description: Game score
 *                 example: 100
 *     responses:
 *       200:
 *         description: Score recorded successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/:slug/scores',
  authenticate,
  validateBodyNotEmpty,
  recordGameScore,
);

/**
 * @swagger
 * /api/games/{slug}/rankings:
 *   get:
 *     summary: Get game rankings
 *     description: Get rankings for a game (global or friends)
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Game slug identifier
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [global, friends]
 *         description: Ranking type
 *     responses:
 *       200:
 *         description: Rankings retrieved successfully
 */
router.get(
  '/:slug/rankings',
  authenticate,
  getGameRanking,
);

/**
 * @swagger
 * /api/games/{slug}/ratings:
 *   post:
 *     summary: Create or update game rating
 *     description: Create or update rating and comment for a game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Game slug identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating value (1-5)
 *               comment:
 *                 type: string
 *                 description: Optional comment
 *     responses:
 *       200:
 *         description: Rating created or updated successfully
 */
router.post(
  '/:slug/ratings',
  authenticate,
  validateBodyNotEmpty,
  createGameRating,
);

/**
 * @swagger
 * /api/games/{slug}/ratings:
 *   get:
 *     summary: List game ratings
 *     description: List ratings and comments with pagination
 *     tags: [Games]
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Game slug identifier
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Ratings retrieved successfully
 */
router.get(
  '/:slug/ratings',
  listGameRatings,
);

/**
 * @swagger
 * /api/games/{slug}/saves:
 *   post:
 *     summary: Save game state
 *     description: Save current game state for the authenticated user
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Game slug identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameState
 *             properties:
 *               gameState:
 *                 type: object
 *                 description: Game state data
 *     responses:
 *       200:
 *         description: Game state saved successfully
 */
router.post(
  '/:slug/saves',
  authenticate,
  validateBodyNotEmpty,
  saveGameState,
);

/**
 * @swagger
 * /api/games/{slug}/saves:
 *   get:
 *     summary: List saved games
 *     description: List saved games for current user
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Game slug identifier
 *     responses:
 *       200:
 *         description: Saved games retrieved successfully
 */
router.get(
  '/:slug/saves',
  authenticate,
  listGameSaves,
);

/**
 * @swagger
 * /api/games/{slug}/saves/{saveId}:
 *   get:
 *     summary: Load saved game
 *     description: Load a specific saved game by ID
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Game slug identifier
 *       - in: path
 *         name: saveId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Save ID
 *     responses:
 *       200:
 *         description: Saved game loaded successfully
 *       404:
 *         description: Save not found
 */
router.get(
  '/:slug/saves/:saveId',
  authenticate,
  loadGameSave,
);

/**
 * @swagger
 * /api/games/{slug}/saves:
 *   delete:
 *     summary: Clear game saves
 *     description: Clear all saves for current user and game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Game slug identifier
 *     responses:
 *       200:
 *         description: Saves cleared successfully
 */
router.delete(
  '/:slug/saves',
  authenticate,
  clearGameSaves,
);

export default router;
