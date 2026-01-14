/**
 * Game Model
 * Handles all game-related database operations
 */

import db from '../db/connection.js';

/**
 * Game Model Class
 * Encapsulates game database operations following MVC pattern
 */
class Game {
  static tableName = 'games';

  /**
   * Find all enabled games
   * @returns {Promise<Array>} Array of enabled game objects
   */
  static async findAllEnabled() {
    return await db(this.tableName)
      .where({ is_enabled: true })
      .whereNull('deleted_at')
      .orderBy('name', 'asc');
  }

  /**
   * Find game by slug
   * @param {string} slug - Game slug
   * @returns {Promise<Object|null>} Game object or null if not found
   */
  static async findBySlug(slug) {
    return await db(this.tableName)
      .where({ slug })
      .where({ is_enabled: true })
      .whereNull('deleted_at')
      .first();
  }

  /**
   * Find game by ID
   * @param {string} id - Game UUID
   * @returns {Promise<Object|null>} Game object or null if not found
   */
  static async findById(id) {
    return await db(this.tableName)
      .where({ id })
      .whereNull('deleted_at')
      .first();
  }
}

export { Game };
