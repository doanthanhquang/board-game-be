/**
 * Migration: Create Profiles Table
 * Creates the profiles table for extended user profile information
 */

export const up = async (knex) => {
  await knex.schema.createTable('profiles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().unique();
    table.string('display_name', 100).nullable();
    table.string('avatar_url', 500).nullable();
    table.text('bio').nullable();
    table.jsonb('preferences').nullable(); // dark_mode, language, etc.

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Foreign key
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    // Indexes
    table.index('user_id');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('profiles');
};
