/**
 * Achievement Controller
 * Handles achievement-related operations
 */

import Achievement from '../models/Achievement.js';
import UserAchievement from '../models/UserAchievement.js';
import { GameScore } from '../models/GameScore.js';
import db from '../db/connection.js';

/**
 * Check achievement criteria and unlock if met
 * @param {Object} criteria - Achievement criteria (JSONB)
 * @param {Object} userData - User data for checking (userId, gameId, score, etc.)
 * @returns {Promise<boolean>} True if criteria is met
 */
const checkAchievementCriteria = async (criteria, userData) => {
  if (!criteria || typeof criteria !== 'object') {
    return false;
  }

  const { type, game_id, threshold, win_count } = criteria;

  switch (type) {
    case 'score_threshold':
      // Check if user's score meets threshold
      if (game_id && userData.gameId && game_id !== userData.gameId) {
        return false;
      }
      if (threshold && userData.score >= threshold) {
        return true;
      }
      break;

    case 'win_count':
      // Check if user's win count meets threshold
      if (game_id && userData.gameId && game_id !== userData.gameId) {
        return false;
      }
      if (win_count) {
        const userWins = await db('game_scores')
          .where({ user_id: userData.userId, result: 'win' })
          .where(function () {
            if (game_id) {
              this.where('game_id', game_id);
            }
          })
          .count('* as count')
          .first();
        const winCount = parseInt(userWins?.count || 0, 10);
        if (winCount >= win_count) {
          return true;
        }
      }
      break;

    case 'game_completion':
      // Check if user has completed the game
      if (game_id && userData.gameId && game_id === userData.gameId) {
        // Check if user has any completed session for this game
        const hasCompleted = await db('game_sessions')
          .where({ user_id: userData.userId, game_id: game_id, status: 'completed' })
          .first();
        if (hasCompleted) {
          return true;
        }
      }
      break;

    default:
      return false;
  }

  return false;
};

/**
 * Get all achievements with user unlock status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, pageSize } = req.query;

    const pagination = await UserAchievement.getAchievementsWithUserStatusPaginated(userId, page, pageSize);

    return res.status(200).json({
      success: true,
      data: pagination,
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching achievements',
    });
  }
};

/**
 * Get achievement by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAchievementById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const achievement = await Achievement.findById(id);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    // Check if user has unlocked this achievement
    const userAchievement = await UserAchievement.findByUserAndAchievement(userId, id);

    const response = {
      ...Achievement.formatAchievement(achievement),
      is_unlocked: !!userAchievement,
      progress: userAchievement?.progress || 0,
      unlocked_at: userAchievement?.unlocked_at || null,
    };

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Get achievement by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching achievement',
    });
  }
};

/**
 * Get user's unlocked achievements
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, pageSize } = req.query;

    const pagination = await UserAchievement.getUserAchievementsWithDetailsPaginated(userId, page, pageSize);

    return res.status(200).json({
      success: true,
      data: pagination,
    });
  } catch (error) {
    console.error('Get user achievements error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching user achievements',
    });
  }
};

/**
 * Check and unlock achievements based on user action
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const checkAndUnlockAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gameId, score, action } = req.body;

    // Get all active achievements
    const achievements = await Achievement.findAll();

    const unlockedAchievements = [];

    // Check each achievement
    for (const achievement of achievements) {
      // Skip if already unlocked
      const existing = await UserAchievement.findByUserAndAchievement(userId, achievement.id);
      if (existing) {
        continue;
      }

      // Check if achievement is relevant to this action
      if (achievement.game_id && gameId && achievement.game_id !== gameId) {
        continue; // Skip game-specific achievements for different games
      }

      // Prepare user data for criteria checking
      const userData = {
        userId,
        gameId,
        score,
        action,
      };

      // Check criteria
      const criteriaMet = await checkAchievementCriteria(achievement.criteria, userData);

      if (criteriaMet) {
        // Unlock achievement
        await UserAchievement.create({
          user_id: userId,
          achievement_id: achievement.id,
          progress: 100,
        });

        unlockedAchievements.push(achievement);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Achievements checked',
      data: {
        unlocked: unlockedAchievements.length,
        achievements: unlockedAchievements.map((a) => Achievement.formatAchievement(a)),
      },
    });
  } catch (error) {
    console.error('Check and unlock achievements error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while checking achievements',
    });
  }
};
