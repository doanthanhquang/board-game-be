/**
 * Migration: Create Update Timestamp Trigger
 * Creates a function and triggers to automatically update updated_at timestamps
 */

export const up = async (knex) => {
  // Create function to update updated_at timestamp
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  // Create triggers for all tables with updated_at column
  const tables = [
    'users',
    'profiles',
    'games',
    'game_configurations',
    'game_sessions',
    'game_saves',
    'game_ratings',
    'friendships',
    'messages',
    'achievements',
  ];

  for (const table of tables) {
    await knex.raw(`
      DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
      CREATE TRIGGER update_${table}_updated_at
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
  }
};

export const down = async (knex) => {
  // Drop triggers
  const tables = [
    'users',
    'profiles',
    'games',
    'game_configurations',
    'game_sessions',
    'game_saves',
    'game_ratings',
    'friendships',
    'messages',
    'achievements',
  ];

  for (const table of tables) {
    await knex.raw(`DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};`);
  }

  // Drop function
  await knex.raw(`DROP FUNCTION IF EXISTS update_updated_at_column();`);
};
