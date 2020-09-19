/* eslint-disable no-console */
import electron from 'electron';
import fs from 'fs';
import knex from 'knex';
import path from 'path';

const exists = (file: string) => {
  try {
    fs.statSync(file);
    return true;
  } catch (err) {
    return false;
  }
};

const file = path.join(electron.app.getPath('userData'), 'mysql.json');

let credentials;

if (!exists(file)) {
  credentials = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'lpe_order_management',
  };
  fs.writeFileSync(file, JSON.stringify(credentials));
} else {
  credentials = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }));
}

const connection = {
  client: 'mysql2',
  connection: credentials,
};

const db = knex(connection);

db.migrate
  .latest({ directory: path.join(__dirname, './migrations') })
  .then(() => db.seed.run({ directory: path.join(__dirname, './seeds') }))
  .then(() => console.log('Migrations done!'))
  .catch(console.error);

export default db;
