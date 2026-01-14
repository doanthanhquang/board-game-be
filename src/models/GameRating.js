/**
 * GameRating Model
 * Handles game rating and comment database operations
 */

import db from '../db/connection.js';

class GameRating {
  static tableName = 'game_ratings';

  /**
   * Create a rating and optional comment for a game by a user.
   * Allows multiple ratings/comments per user per game.
   *
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.gameId
   * @param {number} params.rating
   * @param {string|null} params.comment
   */
  static async createRating({ userId, gameId, rating, comment }) {
    const [inserted] = await db(this.tableName)
      .insert(
        {
          user_id: userId,
          game_id: gameId,
          rating,
          comment: comment ?? null,
        },
        ['id', 'user_id as userId', 'game_id as gameId', 'rating', 'comment', 'created_at as createdAt', 'updated_at as updatedAt'],
      );

    return inserted;
  }

  /**
   * List ratings and comments for a game with pagination.
   *
   * @param {Object} params
   * @param {string} params.gameId
   * @param {number} params.page - 1-based page index
   * @param {number} params.pageSize
   */
  static async listByGame({ gameId, page = 1, pageSize = 5 }) {
    const safePage = Number.isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);
    const safePageSize = Number.isNaN(Number(pageSize)) || Number(pageSize) < 1 ? 5 : Number(pageSize);

    const offset = (safePage - 1) * safePageSize;

    const query = db(this.tableName)
      .select(
        'game_ratings.id',
        'game_ratings.rating',
        'game_ratings.comment',
        'game_ratings.created_at as createdAt',
        'users.id as userId',
        'users.username',
      )
      .leftJoin('users', 'users.id', 'game_ratings.user_id')
      .where('game_ratings.game_id', gameId)
      .orderBy('game_ratings.created_at', 'desc')
      .limit(safePageSize)
      .offset(offset);

    const [items, [{ count } = { count: 0 }]] = await Promise.all([
      query,
      db(this.tableName).where('game_id', gameId).count({ count: '*' }),
    ]);

    return {
      items,
      page: safePage,
      pageSize: safePageSize,
      total: Number(count),
    };
  }
}

export { GameRating };

