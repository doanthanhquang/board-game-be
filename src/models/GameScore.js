/**
 * GameScore Model
 * Handles scoring and ranking logic for games
 */

import db from '../db/connection.js';

class GameScore {
  static tableName = 'game_scores';

  /**
   * Create a score record for a winning session
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.gameId
   * @param {number} params.movesCount
   * @param {string} [params.result='win']
   * @param {string|null} [params.sessionId=null]
   * @returns {Promise<Object>} Created score record
   */
  static async createWinScore({ userId, gameId, movesCount, result = 'win', sessionId = null }) {
    const [score] = await db(this.tableName)
      .insert({
        user_id: userId,
        game_id: gameId,
        session_id: sessionId,
        score: movesCount,
        moves_count: movesCount,
        result,
      })
      .returning('*');

    return score;
  }

  /**
   * Get global ranking for a game based on minimal moves_count
   * @param {string} gameId
   * @param {number} [limit=50]
   * @returns {Promise<Array>}
   */
  static async getGlobalRanking(gameId, limit = 50) {
    const rows = await db('game_scores as gs')
      .join('users as u', 'gs.user_id', 'u.id')
      .where('gs.game_id', gameId)
      .andWhere('gs.result', 'win')
      .groupBy('u.id', 'u.username')
      .select(
        'u.id as user_id',
        'u.username',
        db.raw('MIN(gs.moves_count) as best_moves'),
        db.raw('COUNT(gs.id) as wins'),
        db.raw('MAX(gs.created_at) as last_win_at'),
      )
      .orderBy('best_moves', 'asc')
      .orderBy('last_win_at', 'desc')
      .limit(limit);

    // Add rank index
    return rows.map((row, index) => ({
      rank: index + 1,
      ...row,
    }));
  }

  /**
   * Get friends-only ranking for a game based on minimal moves_count
   * Includes the current user in the results.
   * @param {string} gameId
   * @param {string} userId
   * @param {number} [limit=50]
   * @returns {Promise<Array>}
   */
  static async getFriendsRanking(gameId, userId, limit = 50) {
    // Subquery to get friend ids (bidirectional)
    const friendIdsQuery = db('friendships')
      .where('status', 'accepted')
      .andWhere((qb) => {
        qb.where('requester_id', userId).orWhere('addressee_id', userId);
      })
      .select(
        db.raw(
          'CASE WHEN requester_id = ? THEN addressee_id ELSE requester_id END as friend_id',
          [userId],
        ),
      );

    const rows = await db('game_scores as gs')
      .join('users as u', 'gs.user_id', 'u.id')
      .where('gs.game_id', gameId)
      .andWhere('gs.result', 'win')
      .andWhere((qb) => {
        qb.whereIn('gs.user_id', friendIdsQuery).orWhere('gs.user_id', userId);
      })
      .groupBy('u.id', 'u.username')
      .select(
        'u.id as user_id',
        'u.username',
        db.raw('MIN(gs.moves_count) as best_moves'),
        db.raw('COUNT(gs.id) as wins'),
        db.raw('MAX(gs.created_at) as last_win_at'),
      )
      .orderBy('best_moves', 'asc')
      .orderBy('last_win_at', 'desc')
      .limit(limit);

    // Add rank index
    return rows.map((row, index) => ({
      rank: index + 1,
      ...row,
    }));
  }
}

export { GameScore };

