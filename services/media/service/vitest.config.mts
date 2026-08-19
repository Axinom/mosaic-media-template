import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import baseConfig from '../../../vitest.config.base.mts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  ...baseConfig,
  resolve: {
    alias: [
      // Force bare 'graphql' imports to the CJS build so both ESM import-based
      // callers and CJS require()-based callers (e.g. postgraphile internals)
      // resolve to the same Node.js module-cache entry, preventing the
      // "from another realm" instanceof error.
      {
        find: /^graphql$/,
        replacement: resolve(
          __dirname,
          '../../../node_modules/graphql/index.js',
        ),
      },
      // media-messages is a local workspace library with no pre-built dist;
      // point Vite directly at the TypeScript source so it can compile it.
      {
        find: 'media-messages',
        replacement: resolve(
          __dirname,
          '../../../libs/media-messages/src/index.ts',
        ),
      },
    ],
  },
  test: {
    ...(baseConfig.test ?? {}),
    globals: true, // inject describe/it/expect/vi as runtime globals (matches the ambient types in tsconfig)
    pool: 'forks', // process.chdir() in test-utils/test-config.ts requires fork mode (not supported in threads)
    testTimeout: 60_000,
    name: 'media-service',
    setupFiles: ['./vitest.setup.ts'],
  },
});
