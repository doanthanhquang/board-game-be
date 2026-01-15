/**
 * Profile Model
 * Handles all profile-related database operations
 */

import db from '../db/connection.js';

/**
 * Profile Model Class
 * Encapsulates profile database operations following MVC pattern
 */
class Profile {
  /**
   * Find profile by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Profile object or null if not found
   */
  static async findByUserId(userId) {
    return await db('profiles').where({ user_id: userId }).first();
  }

  /**
   * Create a new profile
   * @param {Object} profileData - Profile data (user_id, display_name, avatar_url, bio, preferences)
   * @returns {Promise<Object>} Created profile object
   */
  static async create(profileData) {
    const [profile] = await db('profiles')
      .insert({
        ...profileData,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      })
      .returning('*');
    return profile;
  }

  /**
   * Update profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile object
   */
  static async update(userId, profileData) {
    const [profile] = await db('profiles')
      .where({ user_id: userId })
      .update({
        ...profileData,
        updated_at: db.fn.now(),
      })
      .returning('*');
    return profile;
  }

  /**
   * Get user with profile information
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} User object with profile or null if not found
   */
  static async getUserWithProfile(userId) {
    const user = await db('users')
      .leftJoin('profiles', 'users.id', 'profiles.user_id')
      .where('users.id', userId)
      .whereNull('users.deleted_at')
      .select(
        'users.id',
        'users.username',
        'users.email',
        'users.role',
        'users.is_active',
        'users.created_at',
        'users.last_login_at',
        'profiles.display_name',
        'profiles.avatar_url',
        'profiles.bio',
        'profiles.preferences',
        'profiles.updated_at as profile_updated_at'
      )
      .first();

    return user;
  }

  /**
   * Create or update profile (upsert)
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data
   * @returns {Promise<Object>} Created or updated profile object
   */
  static async upsert(userId, profileData) {
    const existing = await this.findByUserId(userId);

    if (existing) {
      return await this.update(userId, profileData);
    } else {
      return await this.create({
        user_id: userId,
        ...profileData,
      });
    }
  }
}

export default Profile;
