/**
 * Game Controller
 * Handles game-related operations
 */

import { Game } from '../models/Game.js';

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
