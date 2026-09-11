import { defineConfig } from 'vitest/config';
import baseConfig from '../vitest.config.base.mts';

export default defineConfig({
  ...baseConfig,
  test: {
    ...(baseConfig.test ?? {}),
    name: 'repo-scripts',
  },
});
