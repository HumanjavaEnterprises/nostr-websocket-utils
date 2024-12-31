/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.{test,spec}.ts', 'src/types/**/*']
    },
    testTimeout: 10000,
    teardownTimeout: 1000,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    maxConcurrency: 1
  }
});
