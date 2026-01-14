/**
 * GameSave Model
 * Represents a saved snapshot of a game session
 */

import db from '../db/connection.js';

class GameSave {
  static tableName = 'game_saves';

  /**
   * Count saves for a user and game via sessions
   * @param {string} userId
   * @param {string} gameId
   * @param {import('knex').Knex.Transaction} [trx]
   * @returns {Promise<number>}
   */
  static async countByUserAndGame(userId, gameId, trx) {
    const row = await (trx || db)(this.tableName)
      .join('game_sessions', 'game_saves.session_id', 'game_sessions.id')
      .where('game_saves.user_id', userId)
      .andWhere('game_sessions.game_id', gameId)
      .whereNull('game_sessions.deleted_at')
      .count('* as count')
      .first();

    const value = row?.count;
    if (typeof value === 'number') return value;
    const parsed = typeof value === 'string' ? parseInt(value, 10) : 0;
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Delete all saves for a user and game (via sessions)
   * @param {string} userId
   * @param {string} gameId
   * @param {import('knex').Knex.Transaction} [trx]
   * @returns {Promise<void>}
   */
  static async deleteByUserAndGame(userId, gameId, trx) {
    const qb = trx || db;

    const sessionIdsSubquery = qb('game_sessions')
      .where('user_id', userId)
      .andWhere('game_id', gameId)
      .whereNull('deleted_at')
      .select('id');

    await qb(this.tableName)
      .where('user_id', userId)
      .whereIn('session_id', sessionIdsSubquery)
      .del();
  }

  /**
   * Create a new save
   * @param {Object} params
   * @param {string} params.sessionId
   * @param {string} params.userId
   * @param {Object} params.gameState
   * @param {string} params.saveName
   * @param {import('knex').Knex.Transaction} [trx]
   * @returns {Promise<Object>}
   */
  static async createSave({ sessionId, userId, gameState, saveName }, trx) {
    const [save] = await (trx || db)(this.tableName)
      .insert({
        session_id: sessionId,
        user_id: userId,
        game_state: gameState,
        save_name: saveName,
        created_at: (trx || db).fn.now(),
        updated_at: (trx || db).fn.now(),
      })
      .returning('*');

    return save;
  }

  /**
   * List saves for a user and specific game
   * @param {string} userId
   * @param {string} gameId
   * @param {import('knex').Knex.Transaction} [trx]
   * @returns {Promise<Array>}
   */
  static async listByUserAndGame(userId, gameId, trx) {
    const rows = await (trx || db)(this.tableName)
      .join('game_sessions', 'game_saves.session_id', 'game_sessions.id')
      .where('game_saves.user_id', userId)
      .andWhere('game_sessions.game_id', gameId)
      .whereNull('game_sessions.deleted_at')
      .select(
        'game_saves.id',
        'game_saves.session_id',
        'game_saves.save_name',
        'game_saves.game_state',
        'game_saves.created_at',
        'game_saves.updated_at',
      )
      .orderBy('game_saves.created_at', 'desc');

    return rows;
  }

  /**
   * Find a save by id for a user and game
   * @param {string} id
   * @param {string} userId
   * @param {string} gameId
   * @param {import('knex').Knex.Transaction} [trx]
   * @returns {Promise<Object|null>}
   */
  static async findByIdForUserAndGame(id, userId, gameId, trx) {
    const save = await (trx || db)(this.tableName)
      .join('game_sessions', 'game_saves.session_id', 'game_sessions.id')
      .where('game_saves.id', id)
      .andWhere('game_saves.user_id', userId)
      .andWhere('game_sessions.game_id', gameId)
      .whereNull('game_sessions.deleted_at')
      .select(
        'game_saves.id',
        'game_saves.session_id',
        'game_saves.save_name',
        'game_saves.game_state',
        'game_saves.created_at',
        'game_saves.updated_at',
      )
      .first();

    return save || null;
  }
}

export { GameSave };
