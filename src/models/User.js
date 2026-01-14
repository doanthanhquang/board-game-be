/**
 * User Model
 * Handles all user-related database operations
 */

import db from '../db/connection.js';

/**
 * User Model Class
 * Encapsulates user database operations following MVC pattern
 */
class User {
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByEmail(email) {
    return await db('users')
      .where({ email })
      .whereNull('deleted_at')
      .first();
  }

  /**
   * Find user by username
   * @param {string} username - User username
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByUsername(username) {
    return await db('users')
      .where({ username })
      .whereNull('deleted_at')
      .first();
  }

  /**
   * Find user by email or username
   * @param {string} email - User email (optional)
   * @param {string} username - User username (optional)
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByEmailOrUsername(email, username) {
    if (email) {
      return await this.findByEmail(email);
    }
    if (username) {
      return await this.findByUsername(username);
    }
    return null;
  }

  /**
   * Find user by ID
   * @param {string} id - User ID (UUID)
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findById(id) {
    return await db('users')
      .where({ id })
      .whereNull('deleted_at')
      .first();
  }

  /**
   * Update user's last login timestamp
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  static async updateLastLogin(id) {
    await db('users')
      .where({ id })
      .update({ last_login_at: db.fn.now() });
  }

  /**
   * Create a new user
   * @param {Object} userData - User data (email, username, password_hash, role, etc.)
   * @returns {Promise<Object>} Created user object
   */
  static async create(userData) {
    const [user] = await db('users')
      .insert({
        ...userData,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      })
      .returning('*');
    return user;
  }

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user object
   */
  static async update(id, userData) {
    const [user] = await db('users')
      .where({ id })
      .whereNull('deleted_at')
      .update({
        ...userData,
        updated_at: db.fn.now(),
      })
      .returning('*');
    return user;
  }

  /**
   * Soft delete user (set deleted_at)
   * @param {string} id - User ID
   * @returns {Promise<Object>} Updated user object
   */
  static async softDelete(id) {
    const [user] = await db('users')
      .where({ id })
      .whereNull('deleted_at')
      .update({
        deleted_at: db.fn.now(),
        updated_at: db.fn.now(),
      })
      .returning('*');
    return user;
  }

  /**
   * Check if user is active
   * @param {Object} user - User object
   * @returns {boolean} True if user is active
   */
  static isActive(user) {
    return user && user.is_active === true;
  }

  /**
   * Sanitize user object (remove sensitive data)
   * @param {Object} user - User object
   * @returns {Object} Sanitized user object without password_hash
   */
  static sanitize(user) {
    if (!user) return null;
    const { password_hash, deleted_at, ...sanitized } = user;
    return sanitized;
  }
}

export default User;
