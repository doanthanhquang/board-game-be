/**
 * GameSession Model
 * Represents an active or completed game session with persisted state
 */

import db from '../db/connection.js';

class GameSession {
  static tableName = 'game_sessions';

  /**
   * Find an in-progress session for a user and game
   * @param {string} userId
   * @param {string} gameId
   * @param {import('knex').Knex.Transaction} [trx]
   * @returns {Promise<Object|null>}
   */
  static async findActiveByUserAndGame(userId, gameId, trx) {
    const query = (trx || db)(this.tableName)
      .where({
        user_id: userId,
        game_id: gameId,
        status: 'in_progress',
      })
      .whereNull('deleted_at')
      .orderBy('started_at', 'desc')
      .first();

    return await query;
  }

  /**
   * Create a new in-progress session from a game state snapshot
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.gameId
   * @param {Object} params.gameState
   * @param {import('knex').Knex.Transaction} [trx]
   * @returns {Promise<Object>}
   */
  static async createFromState({ userId, gameId, gameState }, trx) {
    const movesCount = typeof gameState?.moves === 'number' ? gameState.moves : 0;

    const [session] = await (trx || db)(this.tableName)
      .insert({
        user_id: userId,
        game_id: gameId,
        status: 'in_progress',
        game_state: gameState,
        moves_count: movesCount,
        result: null,
        opponent_type: 'computer',
        started_at: (trx || db).fn.now(),
        completed_at: null,
        deleted_at: null,
        created_at: (trx || db).fn.now(),
        updated_at: (trx || db).fn.now(),
      })
      .returning('*');

    return session;
  }

  /**
   * Update session game_state (and moves_count) from a snapshot
   * @param {string} id
   * @param {Object} gameState
   * @param {import('knex').Knex.Transaction} [trx]
   * @returns {Promise<Object>}
   */
  static async updateState(id, gameState, trx) {
    const movesCount = typeof gameState?.moves === 'number' ? gameState.moves : 0;

    const [session] = await (trx || db)(this.tableName)
      .where({ id })
      .whereNull('deleted_at')
      .update(
        {
          game_state: gameState,
          moves_count: movesCount,
          updated_at: (trx || db).fn.now(),
        },
        '*',
      );

    return session;
  }
}

export { GameSession };

