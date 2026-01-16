/**
 * User Achievement Model
 * Handles all user achievement-related database operations
 */

import db from '../db/connection.js';
import { normalizePagination, formatPaginationResponse } from '../db/pagination.js';

/**
 * User Achievement Model Class
 * Encapsulates user achievement database operations following MVC pattern
 */
class UserAchievement {
  /**
   * Find all achievements unlocked by a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of user achievements
   */
  static async findByUserId(userId) {
    return await db('user_achievements')
      .where({ user_id: userId })
      .orderBy('unlocked_at', 'desc');
  }

  /**
   * Find user achievement by user ID and achievement ID
   * @param {string} userId - User ID
   * @param {string} achievementId - Achievement ID
   * @returns {Promise<Object|null>} User achievement object or null if not found
   */
  static async findByUserAndAchievement(userId, achievementId) {
    return await db('user_achievements')
      .where({ user_id: userId, achievement_id: achievementId })
      .first();
  }

  /**
   * Create a new user achievement (unlock achievement)
   * @param {Object} userAchievementData - User achievement data (user_id, achievement_id, progress)
   * @returns {Promise<Object>} Created user achievement object
   */
  static async create(userAchievementData) {
    const [userAchievement] = await db('user_achievements')
      .insert({
        user_id: userAchievementData.user_id,
        achievement_id: userAchievementData.achievement_id,
        progress: userAchievementData.progress || 100,
        unlocked_at: db.fn.now(),
        created_at: db.fn.now(),
      })
      .returning('*');
    return userAchievement;
  }

  /**
   * Update achievement progress
   * @param {string} userId - User ID
   * @param {string} achievementId - Achievement ID
   * @param {number} progress - Progress percentage (0-100)
   * @returns {Promise<Object>} Updated user achievement object
   */
  static async updateProgress(userId, achievementId, progress) {
    const [userAchievement] = await db('user_achievements')
      .where({ user_id: userId, achievement_id: achievementId })
      .update({
        progress: Math.min(100, Math.max(0, progress)),
      })
      .returning('*');
    return userAchievement;
  }

  /**
   * Get user achievements with achievement details
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of achievements with unlock status
   */
  static async getUserAchievementsWithDetails(userId) {
    const userAchievements = await db('user_achievements')
      .where({ user_id: userId })
      .join('achievements', 'user_achievements.achievement_id', 'achievements.id')
      .select(
        'user_achievements.*',
        'achievements.name',
        'achievements.description',
        'achievements.icon_url',
        'achievements.criteria',
        'achievements.game_id'
      )
      .orderBy('user_achievements.unlocked_at', 'desc');

    return userAchievements;
  }

  /**
   * Get all achievements with user unlock status
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of achievements with isUnlocked and progress
   */
  static async getAchievementsWithUserStatus(userId) {
    const achievements = await db('achievements')
      .where('is_active', true)
      .leftJoin('user_achievements', function () {
        this.on('achievements.id', '=', 'user_achievements.achievement_id').andOn(
          'user_achievements.user_id',
          '=',
          db.raw('?', [userId])
        );
      })
      .select(
        'achievements.*',
        db.raw('CASE WHEN user_achievements.id IS NOT NULL THEN true ELSE false END as is_unlocked'),
        'user_achievements.progress',
        'user_achievements.unlocked_at'
      )
      .orderBy('achievements.created_at', 'asc');

    return achievements;
  }

  /**
   * Get all achievements with user unlock status (paginated)
   * @param {string} userId - User ID
   * @param {number|string} page - Page number (1-based)
   * @param {number|string} pageSize - Items per page
   * @returns {Promise<Object>} Paginated response with items, page, pageSize, total
   */
  static async getAchievementsWithUserStatusPaginated(userId, page = 1, pageSize = 20) {
    const { page: safePage, pageSize: safePageSize, offset } = normalizePagination(page, pageSize, 20);

    // Base query for filtering
    const baseQuery = db('achievements')
      .where('is_active', true)
      .leftJoin('user_achievements', function () {
        this.on('achievements.id', '=', 'user_achievements.achievement_id').andOn(
          'user_achievements.user_id',
          '=',
          db.raw('?', [userId])
        );
      });

    // Get paginated achievements
    const achievements = await baseQuery
      .clone()
      .select(
        'achievements.*',
        db.raw('CASE WHEN user_achievements.id IS NOT NULL THEN true ELSE false END as is_unlocked'),
        'user_achievements.progress',
        'user_achievements.unlocked_at'
      )
      .orderBy('achievements.created_at', 'asc')
      .limit(safePageSize)
      .offset(offset);

    // Get total count
    const [{ count } = { count: 0 }] = await db('achievements')
      .where('is_active', true)
      .count({ count: '*' });

    return formatPaginationResponse(achievements, safePage, safePageSize, count);
  }

  /**
   * Get user achievements with achievement details (paginated)
   * @param {string} userId - User ID
   * @param {number|string} page - Page number (1-based)
   * @param {number|string} pageSize - Items per page
   * @returns {Promise<Object>} Paginated response with items, page, pageSize, total
   */
  static async getUserAchievementsWithDetailsPaginated(userId, page = 1, pageSize = 20) {
    const { page: safePage, pageSize: safePageSize, offset } = normalizePagination(page, pageSize, 20);

    // Base query for filtering
    const baseQuery = db('user_achievements')
      .where({ user_id: userId })
      .join('achievements', 'user_achievements.achievement_id', 'achievements.id');

    // Get paginated user achievements
    const userAchievements = await baseQuery
      .clone()
      .select(
        'user_achievements.*',
        'achievements.name',
        'achievements.description',
        'achievements.icon_url',
        'achievements.criteria',
        'achievements.game_id'
      )
      .orderBy('user_achievements.unlocked_at', 'desc')
      .limit(safePageSize)
      .offset(offset);

    // Get total count
    const [{ count } = { count: 0 }] = await baseQuery.clone().count({ count: '*' });

    return formatPaginationResponse(userAchievements, safePage, safePageSize, count);
  }
}

export default UserAchievement;
