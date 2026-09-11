import type { ViteUserConfig } from 'vitest/config';

/**
 * Shared Vitest config for every service in the monorepo.
 *
 * Lives at the monorepo root as `vitest.config.base.mts`. Each project extends
 * it from its own `vitest.config.mts` and adds only project-specific overrides.
 *
 * Option rationale:
 *   - globals: false    -> repo-level script tests use explicit imports;
 *                           service configs override this with `globals: true`
 *                           to preserve their existing ambient test APIs.
 *   - clearMocks: true   -> auto-clears call history after every test, so manual
 *                           `vi.clearAllMocks()` in afterEach is redundant.
 *   - mockReset: false   -> preserves mock implementations between tests, which
 *                           `vi.hoisted()` mocks REQUIRE. Setting it true breaks them.
 *   - restoreMocks: false-> you restore spies yourself with `vi.restoreAllMocks()`,
 *                           and only when a file actually uses `vi.spyOn()`.
 *   - pool: 'threads' + sequence.concurrent: false
 *                        -> different test FILES run in parallel (own worker),
 *                           tests WITHIN a file run sequentially. Required for
 *                           `.db.spec.ts` files that own a database per file.
 *
 * NOTE (Vitest v4): `singleThread` and `poolOptions` were removed. Do not add
 * them. Use `pool: 'threads'` + `sequence.concurrent` as below.
 */
const config: ViteUserConfig = {
  test: {
    globals: false,
    environment: 'node',
    pool: 'threads',
    sequence: {
      concurrent: false,
    },
    clearMocks: true,
    mockReset: false,
    restoreMocks: false,
    include: ['**/*.{test,spec}.{js,ts}'],
    // Projects that register matchers add `setupFiles` in their own config.
  },
};

export default config;
