import { IOptions } from "../types/IOptions";
import { sanitizeMigrationName } from "../utils/path-utils";
import { MigrationFile } from "./migration-file";
import { MigrationGenerator } from "./migration-generator";
import { MigrationRunner } from "./migration-runner";
import { AppDataSource } from "../database/config";
import { Pathfinder } from "./combined-finder";
import { ISearchResult } from "../types/ISearchResult";
import { findConfigFile } from "../utils/find-config-file";

export class MigrationHandler {
  private generator: MigrationGenerator;
  private fileService: MigrationFile;
  private options: IOptions;
  private searchResult: ISearchResult;
  private config: Promise<string>;

  constructor(options: IOptions) {
    this.validateOptions(options);
    this.options = this.buildMigrationOptions(options);
    this.generator = new MigrationGenerator(this.options);
    this.fileService = new MigrationFile(this.options.migrationsPath);
    this.searchResult = new Pathfinder().findConfigAndMigrations(process.cwd());
    this.config = findConfigFile();
  }

  private validateOptions(options: IOptions): void {
    if (!options.migrationName) {
      throw new Error("Please provide a migration name");
    }
  }

  private buildMigrationOptions(options: IOptions): IOptions {
    return {
      migrationName: sanitizeMigrationName(options.migrationName),
      outputType: options.outputType || 'ts',
      configPath: options.configPath,
      migrationsPath: options.migrationsPath
    };
  }

  private async processMigrationFile(): Promise<void> {
    const migrationFile = await this.fileService.findMigrationFile(this.options.migrationName);

    if (!migrationFile) {
      console.log('No changes in database schema were found or migration file was not generated');
      return;
    }

    await this.fileService.verifyMigrationContent(migrationFile);
  }

  private async runMigration(): Promise<void> {
    const dataSource = await AppDataSource(this.searchResult.migrationsPath, this.config);
    await new MigrationRunner().migrationRun(dataSource);
  }

  public async execute(): Promise<void> {
    try {
      await this.generator.generate();
      await this.processMigrationFile();
      await this.runMigration();
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    console.error("Error in migration process:", error.message);
    if (error.stdout) console.log("stdout:", error.stdout);
    if (error.stderr) console.error("stderr:", error.stderr);
    process.exit(1);
  }
}