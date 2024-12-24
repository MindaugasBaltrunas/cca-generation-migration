import fs from "fs";
import path from "path";

export class MigrationFile {
    constructor(private readonly migrationsPath: string) { }

    public async findMigrationFile(migrationName: string): Promise<string | null> {
        try {
            const files = fs.readdirSync(this.migrationsPath);
            const file = files.find(file => file.includes(migrationName));
            return file ? path.join(this.migrationsPath, file) : null;
        } catch (error: any) {
            throw new Error(`Error reading migration files: ${error.message}`);
        }
    }

    public async readMigrationContent(filePath: string): Promise<string> {
        try {
            return fs.readFileSync(filePath, 'utf-8');
        } catch (error: any) {
            throw new Error(`Error reading file at ${filePath}: ${error.message}`);
        }
    }

    public async verifyMigrationContent(filePath: string): Promise<void> {
        const content = await this.readMigrationContent(filePath);
        if (!content.includes('export class') || !content.includes('implements MigrationInterface')) {
            throw new Error('Invalid migration file format');
        }

        const convertedContent = this.convertExportToModuleExports(content);

        try {
            await fs.promises.writeFile(filePath, convertedContent, 'utf-8');
        } catch (error: any) {
            throw new Error(`Error writing converted content to file ${filePath}: ${error.message}`);
        }
    }

    private convertExportToModuleExports(content: string): string {
        return content
            .replace(
                /import\s*{\s*MigrationInterface\s*,\s*QueryRunner\s*}\s*from\s*["']typeorm["']\s*;/,
                'const { MigrationInterface, QueryRunner } = require("typeorm");'
            )
            .replace(/\s+implements\s+MigrationInterface/, '')
            .replace(/:\s*QueryRunner/g, '')
            .replace(/:\s*Promise<void>/g, '')
            .replace(/public\s+/g, '')
            .replace(
                /export\s+class\s+(\w+)/,
                'module.exports = class $1'
            );
    }
}
