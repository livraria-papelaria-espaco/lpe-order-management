import Knex from 'knex';

exports.up = (knex: Knex) =>
  knex.schema.alterTable('customers', (table) => {
    table.timestamps(false, true);
  });

exports.down = (knex: Knex) =>
  knex.schema.alterTable('customers', (table) => {
    table.dropTimestamps();
  });
