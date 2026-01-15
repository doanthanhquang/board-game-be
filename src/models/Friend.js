/**
 * Friend Model
 * Handles all friendship-related database operations
 */

import db from '../db/connection.js';

/**
 * Friend Model Class
 * Encapsulates friendship database operations following MVC pattern
 */
class Friend {
  /**
   * Search users by username or email
   * @param {string} query - Search query (username or email)
   * @param {string} excludeUserId - User ID to exclude from results
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} Array of matching users
   */
  static async searchUsers(query, excludeUserId, limit = 20) {
    const searchTerm = `%${query}%`;
    return await db('users')
      .where(function () {
        this.where('username', 'ilike', searchTerm).orWhere('email', 'ilike', searchTerm);
      })
      .where('id', '!=', excludeUserId)
      .whereNull('deleted_at')
      .where('is_active', true)
      .select('id', 'username', 'email', 'role', 'is_active', 'created_at')
      .limit(limit);
  }

  /**
   * Find friendship by requester and addressee
   * @param {string} requesterId - Requester user ID
   * @param {string} addresseeId - Addressee user ID
   * @returns {Promise<Object|null>} Friendship object or null if not found
   */
  static async findByUsers(requesterId, addresseeId) {
    return await db('friendships')
      .where(function () {
        this.where({ requester_id: requesterId, addressee_id: addresseeId }).orWhere({
          requester_id: addresseeId,
          addressee_id: requesterId,
        });
      })
      .first();
  }

  /**
   * Create a new friendship (friend request)
   * @param {Object} friendshipData - Friendship data (requester_id, addressee_id, status)
   * @returns {Promise<Object>} Created friendship object
   */
  static async create(friendshipData) {
    const [friendship] = await db('friendships')
      .insert({
        ...friendshipData,
        requested_at: db.fn.now(),
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      })
      .returning('*');
    return friendship;
  }

  /**
   * Update friendship status
   * @param {string} id - Friendship ID
   * @param {Object} updateData - Data to update (status, accepted_at, etc.)
   * @returns {Promise<Object>} Updated friendship object
   */
  static async update(id, updateData) {
    const updatePayload = {
      ...updateData,
      updated_at: db.fn.now(),
    };
    // If accepting, set accepted_at if not already set
    if (updateData.status === 'accepted' && !updateData.accepted_at) {
      updatePayload.accepted_at = db.fn.now();
    }
    const [friendship] = await db('friendships')
      .where({ id })
      .update(updatePayload)
      .returning('*');
    return friendship;
  }

  /**
   * Delete friendship
   * @param {string} id - Friendship ID
   * @returns {Promise<number>} Number of deleted rows
   */
  static async delete(id) {
    return await db('friendships').where({ id }).delete();
  }

  /**
   * Find friendship by ID
   * @param {string} id - Friendship ID
   * @returns {Promise<Object|null>} Friendship object or null if not found
   */
  static async findById(id) {
    return await db('friendships').where({ id }).first();
  }

  /**
   * Get pending friend requests for a user (sent and received)
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of pending friendships with user details
   */
  static async getPendingRequests(userId) {
    const requests = await db('friendships')
      .where('status', 'pending')
      .where(function () {
        this.where('requester_id', userId).orWhere('addressee_id', userId);
      })
      .select('friendships.*')
      .orderBy('requested_at', 'desc');

    // Enrich with user details
    const enrichedRequests = await Promise.all(
      requests.map(async (request) => {
        const isRequester = request.requester_id === userId;
        const otherUserId = isRequester ? request.addressee_id : request.requester_id;

        const otherUser = await db('users')
          .where({ id: otherUserId })
          .whereNull('deleted_at')
          .select('id', 'username', 'email')
          .first();

        return {
          ...request,
          isRequester,
          otherUser: otherUser || null,
        };
      })
    );

    return enrichedRequests;
  }

  /**
   * Get accepted friends for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of accepted friendships with friend user details
   */
  static async getAcceptedFriends(userId) {
    const friendships = await db('friendships')
      .where('status', 'accepted')
      .where(function () {
        this.where('requester_id', userId).orWhere('addressee_id', userId);
      })
      .select('friendships.*')
      .orderBy('accepted_at', 'desc');

    // Enrich with friend user details
    const enrichedFriendships = await Promise.all(
      friendships.map(async (friendship) => {
        const friendId =
          friendship.requester_id === userId
            ? friendship.addressee_id
            : friendship.requester_id;

        const friendUser = await db('users')
          .where({ id: friendId })
          .whereNull('deleted_at')
          .select('id', 'username', 'email', 'created_at')
          .first();

        return {
          ...friendship,
          friend: friendUser || null,
        };
      })
    );

    return enrichedFriendships.filter((f) => f.friend !== null);
  }
}

export default Friend;
