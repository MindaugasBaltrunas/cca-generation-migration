import fs from "fs";

export const IGNORED_DIRECTORIES = ["node_modules", "dist", ".git"];

export function isValidDirectory(fullPath: string, itemName: string): boolean {
  try {
    return (
      fs.statSync(fullPath).isDirectory() &&
      !IGNORED_DIRECTORIES.includes(itemName) &&
      !itemName.startsWith(".")
    );
  } catch {
    return false;
  }
}

export function sanitizeMigrationName(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, "_");
}