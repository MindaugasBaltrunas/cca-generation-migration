import { DataSource } from "typeorm";
import fs from "fs";
import { ISearchResult } from "../types/ISearchResult";

export const AppDataSource = async (migrationsPath: string | null, configPath : Promise<string>) => {
  try {

    if (!configPath || !migrationsPath) {
      throw new Error("Configuration path or migrations path is missing");
    }

    const configContent = fs.readFileSync(await configPath, "utf8");
    const config = JSON.parse(configContent);

    return new DataSource({
      name: "postgres",
      type: config.type,
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      synchronize: false,
      logging: ["query", "error", "schema", "migration"],
      logger: "advanced-console",
      entities: [],
      migrations: [`${migrationsPath}/*.ts`],
      migrationsTableName: "migrations",
      migrationsRun: false,
      metadataTableName: "typeorm_metadata",
    });
  } catch (error: any) {
    console.error("Error initializing DataSource:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
};
