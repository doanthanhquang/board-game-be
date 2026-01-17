/**
 * Admin Controller
 * Handles admin dashboard statistics and management operations
 */

import db from '../db/connection.js';

/**
 * Get most played games statistics (game hot)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getGameStats = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    // Count game_sessions grouped by game_id, join with games for names
    const stats = await db('game_sessions as gs')
      .join('games as g', 'gs.game_id', 'g.id')
      .whereNull('gs.deleted_at')
      .whereNull('g.deleted_at')
      .groupBy('g.id', 'g.name', 'g.slug')
      .select(
        'g.id as game_id',
        'g.name as game_name',
        'g.slug as game_slug',
        db.raw('COUNT(gs.id) as play_count')
      )
      .orderBy('play_count', 'desc')
      .limit(limit);

    // Add rank
    const rankedStats = stats.map((stat, index) => ({
      ...stat,
      rank: index + 1,
      play_count: parseInt(stat.play_count, 10),
    }));

    return res.status(200).json({
      success: true,
      data: rankedStats,
    });
  } catch (error) {
    console.error('Get game stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching game statistics',
    });
  }
};

/**
 * Get recent user registrations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getNewAccounts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;

    const users = await db('users')
      .whereNull('deleted_at')
      .select('id as user_id', 'username', 'email', 'created_at', 'role')
      .orderBy('created_at', 'desc')
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Get new accounts error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching new accounts',
    });
  }
};

/**
 * Get top winners (users with most wins)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTopWinners = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;

    // Count game_scores where result='win' grouped by user_id
    const winners = await db('game_scores as gs')
      .join('users as u', 'gs.user_id', 'u.id')
      .where('gs.result', 'win')
      .whereNull('u.deleted_at')
      .groupBy('u.id', 'u.username')
      .select(
        'u.id as user_id',
        'u.username',
        db.raw('COUNT(gs.id) as total_wins')
      )
      .orderBy('total_wins', 'desc')
      .limit(limit);

    // Add rank
    const rankedWinners = winners.map((winner, index) => ({
      ...winner,
      rank: index + 1,
      total_wins: parseInt(winner.total_wins, 10),
    }));

    return res.status(200).json({
      success: true,
      data: rankedWinners,
    });
  } catch (error) {
    console.error('Get top winners error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching top winners',
    });
  }
};

/**
 * Get top points (users with highest total points)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTopPoints = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;

    // Sum score from game_scores grouped by user_id
    const topPoints = await db('game_scores as gs')
      .join('users as u', 'gs.user_id', 'u.id')
      .whereNull('u.deleted_at')
      .groupBy('u.id', 'u.username')
      .select(
        'u.id as user_id',
        'u.username',
        db.raw('SUM(gs.score) as total_points')
      )
      .orderBy('total_points', 'desc')
      .limit(limit);

    // Add rank
    const rankedPoints = topPoints.map((user, index) => ({
      ...user,
      rank: index + 1,
      total_points: parseInt(user.total_points, 10) || 0,
    }));

    return res.status(200).json({
      success: true,
      data: rankedPoints,
    });
  } catch (error) {
    console.error('Get top points error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching top points',
    });
  }
};
