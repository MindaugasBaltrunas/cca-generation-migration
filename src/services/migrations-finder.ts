import path from "path";
import fs from "fs";
import { IMigrationSearchResult } from "../types/IMigrationSearchResult";
import { isValidDirectory } from "../utils/path-utils";

export class MigrationsFinder {
  private readonly migrationsFolder = "migrations";

  public findMigrations(startDir: string): IMigrationSearchResult {
    const result = this.searchMigrationsRecursive(startDir);
    
    if (!result?.migrationsPath) {
      console.warn("Could not find migrations folder in project");
    }
    
    return { migrationsPath: result?.migrationsPath ?? null };
  }

  private searchMigrationsRecursive(dir: string): IMigrationSearchResult | null {
    try {
      const items = fs.readdirSync(dir);
      
      const migrationsDir = items.find(
        (item) =>
          item === this.migrationsFolder && 
          fs.statSync(path.join(dir, item)).isDirectory()
      );
      
      const migrationsPath = migrationsDir 
        ? path.join(dir, migrationsDir) 
        : null;

      if (migrationsPath) {
        return { migrationsPath };
      }

      for (const item of items) {
        const fullPath = path.join(dir, item);
        
        if (!isValidDirectory(fullPath, item)) {
          continue;
        }

        const subResult = this.searchMigrationsRecursive(fullPath);
        if (subResult?.migrationsPath) {
          return subResult;
        }
      }

      return { migrationsPath: null };
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error accessing ${dir}: ${error.message}`);
      }
      return null;
    }
  }
}
