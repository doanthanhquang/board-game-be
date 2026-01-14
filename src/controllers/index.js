/**
 * Controllers Module
 * Central export point for all controllers
 */

import { getHealth, getApiInfo } from './healthController.js';
import { login } from './authController.js';
import { getGames, getGameBySlug, recordGameScore, getGameRanking } from './gameController.js';

export {
  // Health
  getHealth,
  getApiInfo,
  // Authentication
  login,
  // Games
  getGames,
  getGameBySlug,
  recordGameScore,
  getGameRanking,
};
