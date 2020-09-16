/* eslint-disable no-console */
import knex from 'knex';
import path from 'path';

const connection = {
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'password123',
    database: 'lpe_order_management',
  },
};

const db = knex(connection);

db.migrate
  .latest({ directory: path.join(__dirname, './migrations') })
  .then(() => db.seed.run({ directory: path.join(__dirname, './seeds') }))
  .then(() => console.log('Migrations done!'))
  .catch(console.error);

export default db;
