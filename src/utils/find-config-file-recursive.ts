import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { IConfigFinderOptions } from '../types/IConfigFinderOptions';
import { ConfigNotFoundException } from './errors';

export class ConfigFinder {
    private readonly fileName: string;
    private readonly maxDepth: number;
    private readonly startPath: string;

    constructor({
        fileName = 'cca.config.json',
        maxDepth = 10,
        startPath = process.cwd()
    }: IConfigFinderOptions = {}) {
        this.fileName = fileName;
        this.maxDepth = maxDepth;
        this.startPath = startPath;
    }

    public async findConfig(): Promise<string> {
        const configPath = await this.searchConfigRecursive(this.startPath, this.maxDepth);

        if (!configPath) {
            throw new ConfigNotFoundException(
                `Could not find ${this.fileName} in any parent directory of ${this.startPath}`
            );
        }

        return configPath;
    }

    private async searchConfigRecursive(
        currentPath: string,
        depth: number
    ): Promise<string | null> {
        if (depth < 0) {
            return null;
        }

        try {
            const files = await readdir(currentPath);
            const configFile = files.find(file => file === this.fileName);

            if (configFile) {
                return join(currentPath, configFile);
            }

            const parentDir = dirname(currentPath);
            if (parentDir === currentPath) {
                return null; 
            }

            return this.searchConfigRecursive(parentDir, depth - 1);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error accessing ${currentPath}: ${error.message}`);
            }
            return null;
        }
    }
}
