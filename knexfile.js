/**
 * Knex Configuration File
 * Defines database connection settings for different environments
 */

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Get database configuration from environment variables
 */
const getDbConfig = () => {
  // Support both connection string and individual parameters
  return {
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.SUPABASE_DB_SSL === "true"
        ? { rejectUnauthorized: false }
        : false,
  };
};

/**
 * Knex configuration object
 */
export default {
  development: {
    client: "pg",
    connection: getDbConfig(),
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./src/db/migrations",
      tableName: "knex_migrations",
      extension: "js",
      loadExtensions: [".js"],
    },
    debug: process.env.NODE_ENV === "development",
  },

  production: {
    client: "pg",
    connection: getDbConfig(),
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./src/db/migrations",
      tableName: "knex_migrations",
      extension: "js",
      loadExtensions: [".js"],
    },
    debug: false,
  },
};
