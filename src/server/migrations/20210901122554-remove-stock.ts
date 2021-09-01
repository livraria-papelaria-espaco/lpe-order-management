import { Knex } from 'knex';

exports.up = async (knex: Knex) => {
  await knex.schema.table('books', (table) => {
    table.dropColumn('stock');
  });
};

exports.down = async (knex: Knex) => {
  await knex.schema.table('books', (table) => {
    table.integer('stock').unsigned();
  });
};
