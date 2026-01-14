/**
 * Migration: Create Game Scores Table
 * Creates the game_scores table for ranking calculations
 */

export const up = async (knex) => {
  await knex.schema.createTable('game_scores', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable();
    table.uuid('game_id').notNullable();
    table.uuid('session_id').nullable();
    table.integer('score').notNullable();
    table.integer('level').notNullable().defaultTo(1);
    table.integer('time_elapsed').nullable(); // seconds
    table.integer('moves_count').nullable();
    table.string('result', 50).nullable(); // win, loss, draw
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

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
      .onDelete('CASCADE');
    table
      .foreign('session_id')
      .references('id')
      .inTable('game_sessions')
      .onDelete('SET NULL');

    // Indexes
    table.index('user_id');
    table.index('game_id');
    table.index('session_id');
    table.index('score');
    table.index('created_at');
    table.index(['user_id', 'game_id', 'score']);
    table.index(['game_id', 'score', 'created_at']);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('game_scores');
};
