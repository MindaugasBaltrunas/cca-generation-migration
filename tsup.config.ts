import { defineConfig } from 'tsup'; 

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'es2020',
  bundle: true,
  noExternal: [/^@your-scope\/.*/],
  platform: 'node',
  outExtension: () => ({ js: '.js' }),
  env: {
    NODE_ENV: 'production',
  },
  esbuildOptions(options) {
    options.keepNames = true;
    options.mainFields = ['module', 'main'];
    options.conditions = ['module', 'import', 'require'];
    options.resolveExtensions = ['.ts', '.js'];
  },
});