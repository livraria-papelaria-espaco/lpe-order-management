import Knex from 'knex';

exports.up = (knex: Knex) =>
  knex.schema.createTable('customers', (table) => {
    table.increments('id');
    table.string('name', 255).notNullable();
    table.string('phone', 15);
    table.string('email', 255);
  });

exports.down = (knex: Knex) => knex.schema.dropTable('customers');
