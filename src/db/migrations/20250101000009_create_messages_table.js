/**
 * Migration: Create Messages Table
 * Creates the messages table for user-to-user messaging (non-real-time)
 */

export const up = async (knex) => {
  await knex.schema.createTable('messages', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('sender_id').notNullable();
    table.uuid('recipient_id').notNullable();
    table.string('subject', 200).nullable();
    table.text('body').notNullable();
    table.boolean('is_read').notNullable().defaultTo(false);
    table.timestamp('read_at').nullable();
    table.timestamp('deleted_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Foreign keys
    table
      .foreign('sender_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .foreign('recipient_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    // Indexes
    table.index('sender_id');
    table.index('recipient_id');
    table.index('is_read');
    table.index('created_at');
    table.index(['recipient_id', 'is_read', 'created_at']);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('messages');
};
