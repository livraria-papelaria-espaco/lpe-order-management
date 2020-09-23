import path from 'path';

export default class WebpackMigrationSource {
  constructor(
    private migrationContext: __WebpackModuleApi.RequireContext,
    private shouldRunScript: (script: string) => boolean = () => true
  ) {}

  /**
   * Gets the migration names
   * @returns Promise<string[]>
   */
  getMigrations() {
    const migrations = this.migrationContext
      .keys()
      .filter(this.shouldRunScript)
      .sort();

    return Promise.resolve(migrations);
  }

  // eslint-disable-next-line class-methods-use-this
  getMigrationName(migration: string) {
    // Existing migrations were .js files, need to change name to match
    // what is in the database, otherwise we get a corrupted migration
    // error
    return path.basename(migration);
  }

  getMigration(name: string) {
    return this.migrationContext(name);
  }
}
