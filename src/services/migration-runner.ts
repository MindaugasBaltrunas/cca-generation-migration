import { DataSource } from "typeorm";
import { initializeConnection, cleanup } from "../database/initialize-connection";

export class MigrationRunner {

    public migrationRun = async (dataSource: DataSource) => {
        let queryRunner;
        try {
            queryRunner = await initializeConnection(dataSource);
            const initializedDataSource = queryRunner.manager.connection;

            const pendingMigrations = await initializedDataSource.showMigrations();
            console.log("Pending migrations:", pendingMigrations);

            console.log("Running migrations...");
            const migrations = await initializedDataSource.runMigrations({
                transaction: "all",
            });

            console.log("Applied migrations:", migrations.length);
            console.log("Migrations completed successfully!");
        } catch (error) {
            console.error("Migration error:", error);
            throw error;
        } finally {
            await cleanup(dataSource, queryRunner);
        }
    };
}