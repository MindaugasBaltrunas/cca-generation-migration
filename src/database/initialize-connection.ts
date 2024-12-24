import { DataSource, QueryRunner } from "typeorm";

export const initializeConnection = async (dataSourcePromise: DataSource) => {
  try {
    const dataSource = dataSourcePromise;
    if (!dataSource.isInitialized) {
      console.log("Initializing DataSource...");
      await dataSource.initialize();
    }
    return dataSource.createQueryRunner();
  } catch (error) {
    console.error("Error initializing connection:", error);
    throw error;
  }
};

export const cleanup = async (dataSource: DataSource, queryRunner: QueryRunner | undefined) => {
  if (queryRunner) {
    await queryRunner.release();
  }
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
  }
};