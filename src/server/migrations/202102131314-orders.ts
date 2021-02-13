import Knex from 'knex';

exports.up = (knex: Knex) => {
  knex.schema.createTable('orders', (table) => {
    table.increments('id');
    table
      .integer('customer_id')
      .unsigned()
      .references('id')
      .inTable('customers')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.timestamps(false, false);
    table.string('status', 20); // 'pending', 'notified', 'sent'
    table.text('notes');
  });
  knex.schema.createTable('orders_books', (table) => {
    table.increments('id');
    table
      .integer('order_id')
      .unsigned()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.integer('target_quantity').unsigned();
    table.integer('available_quantity').unsigned();
    table.integer('pickedup_quantity').unsigned();
  });
};
exports.down = (knex: Knex) => knex.schema.dropTable('orders');
