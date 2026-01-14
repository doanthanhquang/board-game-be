/**
 * Migration: Create Achievements Table
 * Creates the achievements table for achievement definitions
 */

export const up = async (knex) => {
  await knex.schema.createTable('achievements', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).notNullable();
    table.text('description').nullable();
    table.string('icon_url', 500).nullable();
    table.jsonb('criteria').nullable(); // conditions for unlocking
    table.uuid('game_id').nullable(); // NULL for global achievements
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Foreign key
    table
      .foreign('game_id')
      .references('id')
      .inTable('games')
      .onDelete('SET NULL');

    // Indexes
    table.index('game_id');
    table.index('is_active');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('achievements');
};
