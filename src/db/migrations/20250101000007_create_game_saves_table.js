/**
 * Migration: Create Game Saves Table
 * Creates the game_saves table for save/load functionality
 */

export const up = async (knex) => {
  await knex.schema.createTable('game_saves', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('session_id').notNullable();
    table.uuid('user_id').notNullable();
    table.string('save_name', 100).notNullable();
    table.jsonb('game_state').notNullable();
    table.integer('save_slot').nullable(); // 1-10 for quick saves
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Foreign keys
    table
      .foreign('session_id')
      .references('id')
      .inTable('game_sessions')
      .onDelete('CASCADE');
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    // Unique constraint for save slots (one save per slot per user)
    table.unique(['user_id', 'save_slot']);

    // Indexes
    table.index('session_id');
    table.index('user_id');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('game_saves');
};
