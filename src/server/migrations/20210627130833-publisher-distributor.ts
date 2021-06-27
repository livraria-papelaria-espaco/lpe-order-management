import { Knex } from 'knex';

exports.up = async (knex: Knex) => {
  await knex.schema.createTable('publisher_distributor', (table) => {
    table.string('publisher', 60).primary();
    table.string('distributor', 60);
  });
};

exports.down = async (knex: Knex) => {
  await knex.schema.dropTable('publisher_distributor');
};
