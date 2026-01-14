/**
 * Migration: Create Game Configurations Table
 * Creates the game_configurations table for admin-configurable game settings
 */

export const up = async (knex) => {
  await knex.schema.createTable('game_configurations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('game_id').notNullable();
    table.integer('board_width').notNullable();
    table.integer('board_height').notNullable();
    table.integer('time_limit').nullable(); // seconds, NULL for no limit
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Foreign key
    table
      .foreign('game_id')
      .references('id')
      .inTable('games')
      .onDelete('CASCADE');

    // Indexes
    table.index('game_id');
    table.index('is_active');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('game_configurations');
};
