/**
 * Database Module
 * Central export point for database connection and utilities
 */

import db, { testConnection, closeConnection, pingDatabase } from './connection.js';
import {
  withTransaction,
  formatDatabaseError,
  tableExists,
  getDatabaseVersion,
  getPoolStats,
} from './utilities.js';

export {
  // Database instance
  db,
  // Connection management
  testConnection,
  closeConnection,
  pingDatabase,
  // Utilities
  withTransaction,
  formatDatabaseError,
  tableExists,
  getDatabaseVersion,
  getPoolStats,
};

export default db;
