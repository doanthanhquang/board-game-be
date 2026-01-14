/**
 * Database Configuration
 * Manages database connection settings for Knex.js
 */

/**
 * Get database configuration from environment variables
 * Supports both connection string and individual parameters
 */
export const getDatabaseConfig = () => {
  // Support connection string (DATABASE_URL)
  if (process.env.DATABASE_URL) {
    return {
      client: 'pg',
      connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.SUPABASE_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      },
      pool: {
        min: parseInt(process.env.DB_POOL_MIN || '2'),
        max: parseInt(process.env.DB_POOL_MAX || '10'),
      },
      debug: process.env.NODE_ENV === 'development',
    };
  }

  // Support individual connection parameters
  return {
    client: 'pg',
    connection: {
      host: process.env.SUPABASE_DB_HOST || 'localhost',
      port: parseInt(process.env.SUPABASE_DB_PORT || '5432'),
      database: process.env.SUPABASE_DB_NAME || 'postgres',
      user: process.env.SUPABASE_DB_USER || 'postgres',
      password: process.env.SUPABASE_DB_PASSWORD || '',
      ssl: process.env.SUPABASE_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      max: parseInt(process.env.DB_POOL_MAX || '10'),
    },
    debug: process.env.NODE_ENV === 'development',
  };
};

/**
 * Database configuration object (for backward compatibility)
 */
export const databaseConfig = {
  host: process.env.SUPABASE_DB_HOST || 'localhost',
  port: process.env.SUPABASE_DB_PORT || 5432,
  name: process.env.SUPABASE_DB_NAME || 'postgres',
  user: process.env.SUPABASE_DB_USER || 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD || '',
  ssl: process.env.SUPABASE_DB_SSL === 'true',
  // Connection pool settings
  pool: {
    min: parseInt(process.env.DB_POOL_MIN || '2'),
    max: parseInt(process.env.DB_POOL_MAX || '10'),
  },
};
