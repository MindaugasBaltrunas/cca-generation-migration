import { ISearchResult } from "../types/ISearchResult";
import { ConfigFinder } from "./config-finder";
import { MigrationsFinder } from "./migrations-finder";

export class Pathfinder {
  
  public findConfigAndMigrations = (startDir: string): ISearchResult => {
    const configFinder = new ConfigFinder();
    const migrationsFinder = new MigrationsFinder();

    const { configPath } = configFinder.findConfig(startDir);
    const { migrationsPath } = migrationsFinder.findMigrations(startDir);

    return { configPath, migrationsPath };
  }
}
