import Knex from 'knex';

exports.up = async (knex: Knex) => {
  await knex.schema.table('orders_books', (table) => {
    table
      .string('isbn', 13)
      .references('isbn')
      .inTable('books')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
};
exports.down = async (knex: Knex) => {
  await knex.schema.table('orders_books', (table) => {
    table.dropColumn('isbn');
  });
};
