/**
 * Migration: Create User Achievements Table
 * Creates the user_achievements table for user achievement unlocks
 */

export const up = async (knex) => {
  await knex.schema.createTable('user_achievements', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable();
    table.uuid('achievement_id').notNullable();
    table.timestamp('unlocked_at').notNullable().defaultTo(knex.fn.now());
    table.integer('progress').notNullable().defaultTo(100); // percentage
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    // Foreign keys
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .foreign('achievement_id')
      .references('id')
      .inTable('achievements')
      .onDelete('CASCADE');

    // Unique constraint (one achievement per user)
    table.unique(['user_id', 'achievement_id']);

    // Indexes
    table.index('user_id');
    table.index('achievement_id');
    table.index('unlocked_at');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('user_achievements');
};
