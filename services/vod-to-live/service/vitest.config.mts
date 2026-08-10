import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import baseConfig from '../../../vitest.config.base.mts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  ...baseConfig,
  resolve: {
    alias: [
      // media-messages is a local workspace library with no pre-built dist
      // committed to the repo (its dist/ is gitignored); point Vite directly
      // at the TypeScript source so it can compile it, matching the alias
      // used by media-service/catalog-service for the same package.
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
    testTimeout: 60_000,
    name: 'vod-to-live-service',
  },
});
