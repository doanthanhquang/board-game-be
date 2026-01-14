/**
 * Database Connection
 * Creates and exports the Knex instance for database operations
 */

import knex from 'knex';
import { getDatabaseConfig } from '../config/database.js';

/**
 * Create Knex instance with configuration
 */
const db = knex(getDatabaseConfig());

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connection successful
 */
export const testConnection = async () => {
  try {
    await db.raw('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error.message);
    return false;
  }
};

/**
 * Close database connection
 * Used for graceful shutdown
 */
export const closeConnection = async () => {
  try {
    await db.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error.message);
  }
};

/**
 * Ping database to check connectivity
 * @returns {Promise<{connected: boolean, responseTime: number, error?: string}>}
 */
export const pingDatabase = async () => {
  const startTime = Date.now();
  try {
    await db.raw('SELECT 1');
    const responseTime = Date.now() - startTime;
    return {
      connected: true,
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      connected: false,
      responseTime,
      error: error.message,
    };
  }
};

export default db;
