/**
 * Migration: Create Enum Types
 * Creates PostgreSQL enum types for user roles, session status, and friendship status
 */

export const up = async (knex) => {
  // Create user_role enum
  await knex.raw(`
    DO $$ BEGIN
      CREATE TYPE user_role AS ENUM ('client', 'admin');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // Create session_status enum
  await knex.raw(`
    DO $$ BEGIN
      CREATE TYPE session_status AS ENUM ('in_progress', 'completed', 'abandoned');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // Create friendship_status enum
  await knex.raw(`
    DO $$ BEGIN
      CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'blocked');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);
};

export const down = async (knex) => {
  // Drop enum types (only if no tables are using them)
  await knex.raw(`DROP TYPE IF EXISTS friendship_status CASCADE;`);
  await knex.raw(`DROP TYPE IF EXISTS session_status CASCADE;`);
  await knex.raw(`DROP TYPE IF EXISTS user_role CASCADE;`);
};
