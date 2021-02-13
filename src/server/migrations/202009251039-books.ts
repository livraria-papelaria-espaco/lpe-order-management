import Knex from 'knex';

exports.up = (knex: Knex) =>
  knex.schema.createTable('books', (table) => {
    table.string('isbn', 13).primary();
    table.string('name', 255).notNullable();
    table.string('publisher', 30);
    table.string('provider', 30);
    table.string('type', 30).notNullable(); // CA, Manual, Other
    table.integer('schoolYear').nullable();
    table.string('code_pe', 6).nullable();
    table.timestamps(false, false);
  });

exports.down = (knex: Knex) => knex.schema.dropTable('books');
