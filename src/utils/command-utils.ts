import path from "path";

export function getTypeOrmCommand(
  rootDir: string,
  outputType: "js" | "ts" = "js",
): string {
  const isWindows = process.platform === "win32";

  const typeormPath = path.join(rootDir, "node_modules", "typeorm", "cli.js");
  const tsNodeBin = path.join(rootDir, "node_modules", ".bin", "ts-node");

  if (isWindows) {
    return `cross-env TYPEORM_MIGRATION_EXTENSION=${outputType} "${tsNodeBin}" --esm "${typeormPath}"`;
  }

  const baseCommand = `${tsNodeBin} --esm ${typeormPath}`;

  if (outputType === "js") {
    return `cross-env TYPEORM_MIGRATION_EXTENSION=js ${baseCommand}`;
  }

  return baseCommand;
}

export function escapePathForPlatform(filePath: string): string {
  const isWindows = process.platform === "win32";
  return isWindows ? `"${filePath}"` : `'${filePath}'`;
}
