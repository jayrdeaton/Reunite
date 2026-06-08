import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  outExtension: () => ({ js: '.mjs' }),
  clean: true,
  bundle: true,
  target: 'node20'
})
