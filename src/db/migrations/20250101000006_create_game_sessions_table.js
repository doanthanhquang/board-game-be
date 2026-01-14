/**
 * Migration: Create Game Sessions Table
 * Creates the game_sessions table for active and completed game sessions
 */

export const up = async (knex) => {
  await knex.schema.createTable('game_sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable();
    table.uuid('game_id').notNullable();
    table
      .specificType('status', 'session_status')
      .notNullable()
      .defaultTo('in_progress');
    table.jsonb('game_state').notNullable(); // board state, current player, etc.
    table.integer('score').notNullable().defaultTo(0);
    table.integer('time_elapsed').nullable(); // seconds
    table.integer('moves_count').notNullable().defaultTo(0);
    table.string('result', 50).nullable(); // win, loss, draw, timeout
    table.string('opponent_type', 20).notNullable().defaultTo('computer'); // computer, human
    table.timestamp('started_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('completed_at').nullable();
    table.timestamp('deleted_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Foreign keys
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .foreign('game_id')
      .references('id')
      .inTable('games')
      .onDelete('RESTRICT');

    // Indexes
    table.index('user_id');
    table.index('game_id');
    table.index('status');
    table.index('completed_at');
    table.index(['user_id', 'game_id', 'status']);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('game_sessions');
};
