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

// POST /games/:slug/ratings - Create or update rating and comment
router.post(
  '/:slug/ratings',
  authenticate,
  validateBodyNotEmpty,
  createGameRating,
);

// GET /games/:slug/ratings - List ratings and comments with pagination
router.get(
  '/:slug/ratings',
  listGameRatings,
);

// POST /games/:slug/saves - Save current game state
router.post(
  '/:slug/saves',
  authenticate,
  validateBodyNotEmpty,
  saveGameState,
);

// GET /games/:slug/saves - List saved games for current user
router.get(
  '/:slug/saves',
  authenticate,
  listGameSaves,
);

// GET /games/:slug/saves/:saveId - Load a specific saved game
router.get(
  '/:slug/saves/:saveId',
  authenticate,
  loadGameSave,
);

// DELETE /games/:slug/saves - Clear all saves for current user and game
router.delete(
  '/:slug/saves',
  authenticate,
  clearGameSaves,
);

export default router;
