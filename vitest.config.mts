import { defineConfig } from 'vitest/config';

/**
 * Root-level aggregator so `yarn test:ci` runs every service's suite plus the
 * repo-level `scripts/` suite in a single Vitest process and produces one
 * combined JUnit + coverage report.
 *
 * New services land here automatically the moment they get their own
 * `vitest.config.mts` — no edits needed as more services are added.
 *
 * `reporters` / `outputFile` / `coverage` are root-only options in Vitest's
 * projects feature (each project keeps its own `pool`, `setupFiles`,
 * `resolve.alias`, etc. from its own config).
 */
export default defineConfig({
  test: {
    projects: [
      'services/*/service/vitest.config.mts',
      'services/*/workflows/vitest.config.mts',
      'scripts/vitest.config.mts',
    ],
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './vitest-report/junit.xml',
    },
    coverage: {
      provider: 'v8',
      include: ['**/*.{ts,tsx}'],
      exclude: [
        '**/*.d.ts',
        '**/*.{spec,test}.{ts,tsx}',
        '**/*.stories.tsx',
        '**/node_modules/**',
        '**/dist/**',
        '**/vendor/**',
      ],
      reporter: ['text', 'cobertura'],
      reportsDirectory: './coverage-vitest',
    },
  },
});
