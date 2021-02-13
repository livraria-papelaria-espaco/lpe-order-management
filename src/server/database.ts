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

const databaseFile = path.join(electron.app.getPath('userData'), 'db.sqlite');

const connection = {
  client: 'sqlite3',
  connection: {
    filename: databaseFile,
  },
  useNullAsDefault: true,
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
