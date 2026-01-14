/**
 * Game Routes
 * Defines routes for game-related operations
 */

import express from 'express';
import { getGames, getGameBySlug, recordGameScore, getGameRanking } from '../controllers/gameController.js';
import { authenticate, validateBodyNotEmpty } from '../middleware/index.js';

const router = express.Router();

// GET /games - Get all enabled games
router.get('/', getGames);

// GET /games/:slug - Get game by slug
router.get('/:slug', getGameBySlug);

// POST /games/:slug/scores - Record score for a completed game (winner only)
router.post(
  '/:slug/scores',
  authenticate,
  validateBodyNotEmpty,
  recordGameScore,
);

// GET /games/:slug/rankings - Get rankings (global or friends)
router.get(
  '/:slug/rankings',
  authenticate,
  getGameRanking,
);

export default router;
