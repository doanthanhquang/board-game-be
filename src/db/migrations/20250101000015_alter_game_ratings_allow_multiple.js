/**
 * Migration: Alter Game Ratings to Allow Multiple per User per Game
 * Drops the unique constraint on (user_id, game_id) so a user can leave multiple comments.
 */

export const up = async (knex) => {
  await knex.schema.alterTable('game_ratings', (table) => {
    table.dropUnique(['user_id', 'game_id']);
  });
};

export const down = async (knex) => {
  await knex.schema.alterTable('game_ratings', (table) => {
    table.unique(['user_id', 'game_id']);
  });
};

