/**
 * Migration: Create Friendships Table
 * Creates the friendships table for friend relationships
 */

export const up = async (knex) => {
  await knex.schema.createTable('friendships', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('requester_id').notNullable();
    table.uuid('addressee_id').notNullable();
    table
      .specificType('status', 'friendship_status')
      .notNullable()
      .defaultTo('pending');
    table.timestamp('requested_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('accepted_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Foreign keys
    table
      .foreign('requester_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .foreign('addressee_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    // Constraints
    table.check('requester_id != addressee_id', [], 'no_self_friendship');
    table.unique(['requester_id', 'addressee_id']);

    // Indexes
    table.index('requester_id');
    table.index('addressee_id');
    table.index('status');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('friendships');
};
