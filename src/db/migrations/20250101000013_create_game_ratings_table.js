/**
 * Migration: Create Game Ratings Table
 * Creates the game_ratings table for user ratings and comments
 */

export const up = async (knex) => {
  await knex.schema.createTable('game_ratings', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable();
    table.uuid('game_id').notNullable();
    table.integer('rating').notNullable();
    table.text('comment').nullable();
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
      .onDelete('CASCADE');

    // Check constraint for rating (1-5)
    table.check('rating >= 1 AND rating <= 5', [], 'rating_range');

    // Unique constraint (one rating per user per game)
    table.unique(['user_id', 'game_id']);

    // Indexes
    table.index('game_id');
    table.index('rating');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('game_ratings');
};
