import { Knex } from 'knex';

exports.up = async (knex: Knex) => {
  await knex.schema.createTable('orders_books_history', (table) => {
    table.increments('id');
    table
      .integer('orders_books_id')
      .unsigned()
      .references('id')
      .inTable('orders_books')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.timestamp('timestamp');
    table.integer('quantity');
    table.string('type', 15); // "from_stock", "ordered", "arrived", "pickedup"
  });
};

exports.down = async (knex: Knex) => {
  await knex.schema.dropTable('orders_books_history');
};
