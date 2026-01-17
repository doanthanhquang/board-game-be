/**
 * Game Model
 * Handles all game-related database operations
 */

import db from '../db/connection.js';
import { normalizePagination, formatPaginationResponse } from '../db/pagination.js';

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
   * Find all enabled games with pagination
   * @param {number|string} page - Page number (1-based)
   * @param {number|string} pageSize - Items per page
   * @returns {Promise<Object>} Paginated response with items, page, pageSize, total
   */
  static async findAllEnabledPaginated(page = 1, pageSize = 20) {
    const { page: safePage, pageSize: safePageSize, offset } = normalizePagination(page, pageSize, 20);

    // Base query for filtering
    const baseQuery = db(this.tableName)
      .where({ is_enabled: true })
      .whereNull('deleted_at');

    // Get paginated games
    const games = await baseQuery
      .clone()
      .orderBy('created_at', 'desc')
      .limit(safePageSize)
      .offset(offset);

    // Get total count
    const [{ count } = { count: 0 }] = await baseQuery.clone().count({ count: '*' });

    return formatPaginationResponse(games, safePage, safePageSize, count);
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

  /**
   * Find all games with pagination (includes disabled games, for admin use)
   * @param {number|string} page - Page number (1-based)
   * @param {number|string} pageSize - Items per page
   * @param {string} search - Optional search term (name or slug)
   * @returns {Promise<Object>} Paginated response with items, page, pageSize, total
   */
  static async findAllPaginated(page = 1, pageSize = 20, search = null) {
    const { page: safePage, pageSize: safePageSize, offset } = normalizePagination(page, pageSize, 20);

    // Base query for filtering
    let baseQuery = db(this.tableName).whereNull('deleted_at');

    // Apply search filter if provided
    if (search && typeof search === 'string' && search.trim().length > 0) {
      const searchTerm = `%${search.trim()}%`;
      baseQuery = baseQuery.where(function () {
        this.where('name', 'ilike', searchTerm).orWhere('slug', 'ilike', searchTerm);
      });
    }

    // Get paginated games
    const games = await baseQuery
      .clone()
      .orderBy('created_at', 'desc')
      .limit(safePageSize)
      .offset(offset);

    // Get total count
    const [{ count } = { count: 0 }] = await baseQuery.clone().count({ count: '*' });

    return formatPaginationResponse(games, safePage, safePageSize, count);
  }

  /**
   * Update game configuration
   * @param {string} id - Game ID
   * @param {Object} updateData - Data to update (default_board_width, default_board_height, default_time_limit, is_enabled)
   * @returns {Promise<Object>} Updated game object
   */
  static async updateConfig(id, updateData) {
    const [game] = await db(this.tableName)
      .where({ id })
      .whereNull('deleted_at')
      .update({
        ...updateData,
        updated_at: db.fn.now(),
      })
      .returning('*');
    return game;
  }
}

export { Game };
