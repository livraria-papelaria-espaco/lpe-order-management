/* eslint-disable no-console */
import electron from 'electron';
import fs from 'fs';
import knex from 'knex';
import path from 'path';
import WebpackMigrationSource from './WebpackMigrationSource';

// Hack to support require.context in dev
if (typeof require.context === 'undefined') {
  const requireContext = (
    base = '.',
    scanSubDirectories = false,
    regularExpression = /\.ts$/
  ) => {
    const files: { [fullPath: string]: true } = {};

    function readDirectory(directory: string) {
      fs.readdirSync(directory).forEach((file: string) => {
        const fullPath = path.resolve(directory, file);

        if (fs.statSync(fullPath).isDirectory()) {
          if (scanSubDirectories) {
            readDirectory(fullPath);
          }
          return;
        }

        if (!regularExpression.test(fullPath)) {
          return;
        }

        files[fullPath] = true;
      });
    }

    readDirectory(path.resolve(__dirname, base));

    function Module(file: string) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      return require(file);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Module as any).keys = () => Object.keys(files);

    return Module;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  require.context = requireContext as any;
}

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
  .latest({
    migrationSource: new WebpackMigrationSource(
      require.context('./migrations', true, /\.ts$/)
    ),
  })
  .then(() => console.log('Migrations done!'))
  .catch(console.error);

export default db;
