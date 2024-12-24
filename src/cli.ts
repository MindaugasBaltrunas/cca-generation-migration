#!/usr/bin/env node
import { Pathfinder } from './services/combined-finder';
import { MigrationHandler } from './services/handle-migration';
import { IOptions } from './types/IOptions';

async function run() {
  try {
    const args = process.argv.slice(2);

    if (args.length === 0) {
      console.error('Usage: npx cca-migration-generator <migrationName>');
      process.exit(1);
    }

    const migrationName = args[0];
    const searchResult = new Pathfinder().findConfigAndMigrations(process.cwd());

    const options: IOptions = {
      migrationName,
      outputType: 'ts',
      configPath: searchResult.configPath ?? '',
      migrationsPath: searchResult.migrationsPath ?? ''
    };

    await new MigrationHandler(options).execute()
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

run().catch(console.error);