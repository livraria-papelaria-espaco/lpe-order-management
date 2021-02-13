import Knex from 'knex';

exports.up = (knex: Knex) =>
  knex.schema.alterTable('customers', (table) => {
    table.unique(['phone']);
    table.unique(['email']);
  });

exports.down = (knex: Knex) =>
  knex.schema.alterTable('customers', (table) => {
    table.dropUnique(['phone']);
    table.dropUnique(['email']);
  });
