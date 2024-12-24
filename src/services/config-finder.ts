import path from "path";
import fs from "fs";
import { IConfigSearchResult } from "../types/IConfigSearchResult";
import { isValidDirectory } from "../utils/path-utils";

export class ConfigFinder {
  private readonly configFileName = "config.ts";

  public findConfig(startDir: string): IConfigSearchResult {
    const result = this.searchConfigRecursive(startDir);

    if (!result?.configPath) {
      console.warn("Could not find config.ts in project");
    }

    return { configPath: result?.configPath ?? null };
  }

  private searchConfigRecursive(dir: string): IConfigSearchResult | null {
    try {
      const items = fs.readdirSync(dir);

      // Check for config file in current directory
      const configPath = items.includes(this.configFileName)
        ? path.join(dir, this.configFileName)
        : null;

      if (configPath) {
        return { configPath };
      }

      // Recursively search subdirectories
      for (const item of items) {
        const fullPath = path.join(dir, item);

        if (!isValidDirectory(fullPath, item)) {
          continue;
        }

        const subResult = this.searchConfigRecursive(fullPath);
        if (subResult?.configPath) {
          return subResult;
        }
      }

      return { configPath: null };
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error accessing ${dir}: ${error.message}`);
      }
      return null;
    }
  }
}