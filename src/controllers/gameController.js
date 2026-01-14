/**
 * Game Controller
 * Handles game-related operations
 */

import { Game, GameScore, GameRating } from '../models/index.js';

/**
 * Get all enabled games
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getGames = async (req, res) => {
  try {
    const games = await Game.findAllEnabled();

    return res.status(200).json({
      success: true,
      data: games,
    });
  } catch (error) {
    console.error('Get games error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching games',
    });
  }
};

/**
 * Get game by slug
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getGameBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Game slug is required',
      });
    }

    const game = await Game.findBySlug(slug);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    console.error('Get game by slug error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching game',
    });
  }
};

/**
 * Record a Caro game score for a winning session
 * Expects authenticated user and body with movesCount and result
 * Only records score when result indicates player win.
 *
 * POST /games/:slug/scores
 */
export const recordGameScore = async (req, res) => {
  try {
    const { slug } = req.params;
    const { movesCount, result } = req.body || {};

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Game slug is required',
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const parsedMoves = Number(movesCount);
    if (!parsedMoves || Number.isNaN(parsedMoves) || parsedMoves <= 0) {
      return res.status(400).json({
        success: false,
        message: 'movesCount must be a positive number',
      });
    }

    // We only record scores when the player actually won
    // Frontend uses gameStatus 'player-won' for player victory
    if (result !== 'player-won' && result !== 'win') {
      return res.status(200).json({
        success: true,
        message: 'Score not recorded for non-winning result',
      });
    }

    const game = await Game.findBySlug(slug);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    const score = await GameScore.createWinScore({
      userId: req.user.id,
      gameId: game.id,
      movesCount: parsedMoves,
      result: 'win',
      sessionId: null,
    });

    return res.status(201).json({
      success: true,
      data: score,
    });
  } catch (error) {
    console.error('Record game score error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while recording game score',
    });
  }
};

/**
 * Get rankings for a game
 * GET /games/:slug/rankings?scope=global|friends
 */
export const getGameRanking = async (req, res) => {
  try {
    const { slug } = req.params;
    const { scope = 'global' } = req.query;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Game slug is required',
      });
    }

    const game = await Game.findBySlug(slug);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    let rankings = [];

    if (scope === 'friends') {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required for friends ranking',
        });
      }
      rankings = await GameScore.getFriendsRanking(game.id, req.user.id);
    } else {
      rankings = await GameScore.getGlobalRanking(game.id);
    }

    return res.status(200).json({
      success: true,
      data: rankings,
    });
  } catch (error) {
    console.error('Get game ranking error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching rankings',
    });
  }
};

/**
 * Create or update a comment and rating for a game
 * POST /games/:slug/ratings
 */
export const createGameRating = async (req, res) => {
  try {
    const { slug } = req.params;
    const { rating, comment } = req.body || {};

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Game slug is required',
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const parsedRating = Number(rating);
    if (!parsedRating || Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5',
      });
    }

    const game = await Game.findBySlug(slug);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    const result = await GameRating.createRating({
      userId: req.user.id,
      gameId: game.id,
      rating: parsedRating,
      comment: typeof comment === 'string' && comment.trim().length > 0 ? comment.trim() : null,
    });

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Create game rating error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating game rating',
    });
  }
};

/**
 * List comments and ratings for a game with pagination
 * GET /games/:slug/ratings?page=1&pageSize=5
 */
export const listGameRatings = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, pageSize = 5 } = req.query;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Game slug is required',
      });
    }

    const game = await Game.findBySlug(slug);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    const pagination = await GameRating.listByGame({
      gameId: game.id,
      page: Number(page),
      pageSize: Number(pageSize),
    });

    return res.status(200).json({
      success: true,
      data: pagination,
    });
  } catch (error) {
    console.error('List game ratings error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching game ratings',
    });
  }
};
