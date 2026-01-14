/**
 * Game Routes
 * Defines routes for game-related operations
 */

import express from 'express';
import { getGames, getGameBySlug } from '../controllers/gameController.js';

const router = express.Router();

// GET /games - Get all enabled games
router.get('/', getGames);

// GET /games/:slug - Get game by slug
router.get('/:slug', getGameBySlug);

export default router;
