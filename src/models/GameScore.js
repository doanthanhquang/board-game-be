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
   * Get global ranking for a game.
   * Default sort is by minimal moves_count; can be overridden by sort parameter.
   * For Caro games (caro-4, caro-5), default sort is by wins DESC, then best_moves ASC.
   * @param {string} gameId
   * @param {number} [limit=50]
   * @param {string} [sort='best_moves'] - 'best_moves' | 'wins' | 'best_score'
   * @param {string} [gameSlug] - Optional game slug to determine if it's a Caro game
   * @returns {Promise<Array>}
   */
  static async getGlobalRanking(gameId, limit = 50, sort = 'best_moves', gameSlug = null) {
    // Check if this is a Caro game
    const isCaroGame = gameSlug === 'caro-4' || gameSlug === 'caro-5';
    
    // For Caro games, default to wins-based sorting
    if (isCaroGame && sort === 'best_moves') {
      sort = 'wins_then_moves';
    }

    let query = db('game_scores as gs')
      .join('users as u', 'gs.user_id', 'u.id')
      .where('gs.game_id', gameId)
      .andWhere('gs.result', 'win')
      .groupBy('u.id', 'u.username')
      .select(
        'u.id as user_id',
        'u.username',
        db.raw('MIN(gs.moves_count) as best_moves'),
        db.raw('MAX(gs.score) as best_score'),
        db.raw('COUNT(gs.id) as wins'),
        db.raw('MAX(gs.created_at) as last_win_at'),
      );

    if (sort === 'wins_then_moves') {
      // For Caro: wins DESC, then best_moves ASC (fewer moves = better)
      query = query.orderBy('wins', 'desc').orderBy('best_moves', 'asc');
    } else if (sort === 'wins') {
      query = query.orderBy('wins', 'desc').orderBy('last_win_at', 'desc');
    } else if (sort === 'best_score') {
      query = query.orderBy('best_score', 'desc').orderBy('last_win_at', 'desc');
    } else {
      query = query.orderBy('best_moves', 'asc').orderBy('last_win_at', 'desc');
    }

    const rows = await query.limit(limit);

    // Add rank index
    return rows.map((row, index) => ({
      rank: index + 1,
      ...row,
    }));
  }

  /**
   * Get friends-only ranking for a game.
   * Default sort is by minimal moves_count; can be overridden by sort parameter.
   * For Caro games (caro-4, caro-5), default sort is by wins DESC, then best_moves ASC.
   * Includes the current user in the results.
   * @param {string} gameId
   * @param {string} userId
   * @param {number} [limit=50]
   * @param {string} [sort='best_moves'] - 'best_moves' | 'wins' | 'best_score'
   * @param {string} [gameSlug] - Optional game slug to determine if it's a Caro game
   * @returns {Promise<Array>}
   */
  static async getFriendsRanking(gameId, userId, limit = 50, sort = 'best_moves', gameSlug = null) {
    // Check if this is a Caro game
    const isCaroGame = gameSlug === 'caro-4' || gameSlug === 'caro-5';
    
    // For Caro games, default to wins-based sorting
    if (isCaroGame && sort === 'best_moves') {
      sort = 'wins_then_moves';
    }

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

    let query = db('game_scores as gs')
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
        db.raw('MAX(gs.score) as best_score'),
        db.raw('COUNT(gs.id) as wins'),
        db.raw('MAX(gs.created_at) as last_win_at'),
      );

    if (sort === 'wins_then_moves') {
      // For Caro: wins DESC, then best_moves ASC (fewer moves = better)
      query = query.orderBy('wins', 'desc').orderBy('best_moves', 'asc');
    } else if (sort === 'wins') {
      query = query.orderBy('wins', 'desc').orderBy('last_win_at', 'desc');
    } else if (sort === 'best_score') {
      query = query.orderBy('best_score', 'desc').orderBy('last_win_at', 'desc');
    } else {
      query = query.orderBy('best_moves', 'asc').orderBy('last_win_at', 'desc');
    }

    const rows = await query.limit(limit);

    // Add rank index
    return rows.map((row, index) => ({
      rank: index + 1,
      ...row,
    }));
  }

  /**
   * Get best scores for a user across all games
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of best scores per game
   */
  static async getUserBestScores(userId) {
    const scores = await db('game_scores as gs')
      .join('games as g', 'gs.game_id', 'g.id')
      .where('gs.user_id', userId)
      .andWhere('gs.result', 'win')
      .andWhere('g.is_enabled', true)
      .whereNull('g.deleted_at')
      .groupBy('g.id', 'g.name', 'g.slug')
      .select(
        'g.id as game_id',
        'g.name as game_name',
        'g.slug as game_slug',
        db.raw('MIN(gs.moves_count) as best_moves'),
        db.raw('MAX(gs.score) as best_score'),
        db.raw('COUNT(gs.id) as wins'),
      )
      .orderBy('g.name', 'asc');

    return scores;
  }

  /**
   * Get total games played for a user
   * @param {string} userId - User ID
   * @returns {Promise<number>} Total number of game sessions
   */
  static async getTotalGamesPlayed(userId) {
    const result = await db('game_sessions')
      .where('user_id', userId)
      .count('id as total')
      .first();

    return parseInt(result?.total || 0, 10);
  }

  /**
   * Get win rate for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Object with total games, wins, and win rate percentage
   */
  static async getWinRate(userId) {
    const totalGames = await this.getTotalGamesPlayed(userId);
    const winsResult = await db('game_scores')
      .where('user_id', userId)
      .andWhere('result', 'win')
      .count('id as wins')
      .first();

    const wins = parseInt(winsResult?.wins || 0, 10);
    const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : 0;

    return {
      totalGames,
      wins,
      winRate: parseFloat(winRate),
    };
  }
}

export { GameScore };

