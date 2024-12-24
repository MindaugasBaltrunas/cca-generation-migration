import { execSync } from "child_process";
import path from "path";
import { IOptions } from "../types/IOptions";
import {
  getTypeOrmCommand,
  escapePathForPlatform,
} from "../utils/command-utils";

export class MigrationGenerator {
  constructor(private readonly options: IOptions) { }

  public async generate() {
    const command = getTypeOrmCommand(process.cwd(), this.options.outputType);
    const escapedConfigPath = escapePathForPlatform(this.options.configPath);
    const escapedMigrationPath = escapePathForPlatform(
      path.join(this.options.migrationsPath, this.options.migrationName)
    );

    execSync(
      `${command} migration:generate -d ${escapedConfigPath} ${escapedMigrationPath}`,
      {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
        cwd: process.cwd(),
      }
    );
  }
}