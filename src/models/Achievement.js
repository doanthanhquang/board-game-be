/**
 * Achievement Model
 * Handles all achievement-related database operations
 */

import db from '../db/connection.js';

/**
 * Achievement Model Class
 * Encapsulates achievement database operations following MVC pattern
 */
class Achievement {
  /**
   * Find all active achievements
   * @returns {Promise<Array>} Array of active achievements
   */
  static async findAll() {
    return await db('achievements')
      .where('is_active', true)
      .orderBy('created_at', 'asc');
  }

  /**
   * Find achievement by ID
   * @param {string} id - Achievement ID
   * @returns {Promise<Object|null>} Achievement object or null if not found
   */
  static async findById(id) {
    return await db('achievements').where({ id }).first();
  }

  /**
   * Find achievements by game ID
   * @param {string} gameId - Game ID
   * @returns {Promise<Array>} Array of game-specific achievements
   */
  static async findByGameId(gameId) {
    return await db('achievements')
      .where({ game_id: gameId, is_active: true })
      .orderBy('created_at', 'asc');
  }

  /**
   * Find global achievements (not game-specific)
   * @returns {Promise<Array>} Array of global achievements
   */
  static async findGlobal() {
    return await db('achievements')
      .whereNull('game_id')
      .where('is_active', true)
      .orderBy('created_at', 'asc');
  }

  /**
   * Format achievement data
   * @param {Object} achievement - Achievement object from database
   * @returns {Object} Formatted achievement object
   */
  static formatAchievement(achievement) {
    if (!achievement) return null;

    return {
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon_url: achievement.icon_url,
      criteria: achievement.criteria,
      game_id: achievement.game_id,
      is_active: achievement.is_active,
      created_at: achievement.created_at,
      updated_at: achievement.updated_at,
    };
  }
}

export default Achievement;
