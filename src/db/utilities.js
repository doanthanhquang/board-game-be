/**
 * Database Utilities
 * Helper functions for common database operations
 */

import db from './connection.js';

/**
 * Transaction wrapper utility
 * Automatically handles begin, commit, and rollback
 * @param {Function} callback - Async function that receives transaction object
 * @returns {Promise<any>} Result from callback
 */
export const withTransaction = async (callback) => {
  const trx = await db.transaction();
  try {
    const result = await callback(trx);
    await trx.commit();
    return result;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

/**
 * Format database error for consistent error responses
 * @param {Error} error - Database error
 * @returns {Object} Formatted error object
 */
export const formatDatabaseError = (error) => {
  // Hide sensitive information in production
  const isProduction = process.env.NODE_ENV === 'production';

  const formattedError = {
    message: error.message || 'Database error occurred',
    code: error.code || 'DB_ERROR',
  };

  // Include additional details in development
  if (!isProduction) {
    formattedError.detail = error.detail;
    formattedError.hint = error.hint;
    formattedError.constraint = error.constraint;
  }

  return formattedError;
};

/**
 * Check if a table exists in the database
 * @param {string} tableName - Name of the table
 * @returns {Promise<boolean>} True if table exists
 */
export const tableExists = async (tableName) => {
  try {
    const result = await db.raw(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ?
      )`,
      [tableName]
    );
    return result.rows[0].exists;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error.message);
    return false;
  }
};

/**
 * Get database version
 * @returns {Promise<string>} PostgreSQL version
 */
export const getDatabaseVersion = async () => {
  try {
    const result = await db.raw('SELECT version()');
    return result.rows[0].version;
  } catch (error) {
    console.error('Error getting database version:', error.message);
    return 'Unknown';
  }
};

/**
 * Get connection pool stats
 * @returns {Object} Pool statistics
 */
export const getPoolStats = () => {
  const pool = db.client.pool;
  return {
    min: pool.min,
    max: pool.max,
    numUsed: pool.numUsed(),
    numFree: pool.numFree(),
    numPendingAcquires: pool.numPendingAcquires(),
    numPendingCreates: pool.numPendingCreates(),
  };
};
