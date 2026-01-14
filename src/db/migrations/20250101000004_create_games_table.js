/**
 * Migration: Create Games Table
 * Creates the games table for game type definitions
 */

export const up = async (knex) => {
  await knex.schema.createTable('games', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).notNullable();
    table.string('slug', 100).notNullable().unique();
    table.text('description').nullable();
    table.text('instructions').nullable();
    table.string('game_type', 50).notNullable();
    table.boolean('is_enabled').notNullable().defaultTo(true);
    table.integer('default_board_width').notNullable().defaultTo(3);
    table.integer('default_board_height').notNullable().defaultTo(3);
    table.integer('default_time_limit').nullable(); // seconds, NULL for no limit
    table.uuid('created_by').nullable();
    table.timestamp('deleted_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Foreign key
    table
      .foreign('created_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    // Indexes
    table.index('slug');
    table.index('game_type');
    table.index('is_enabled');
    table.index('created_by');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('games');
};
