import { createTestDbIdentifier, Dict } from '@axinom/mosaic-service-common';
import * as dotenv from 'dotenv';
import { join, resolve } from 'path';
import { Config, getFullConfig } from '../../common';

// Resolve service paths consistently when tests start at the monorepo root.
export const TEST_EXEC_ROOT = join(__dirname, '..', '..', '..');

export const createTestConfig = (
  overrides: Dict<string> = {},
  testFilePath?: string,
): Config => {
  // Load monorepo environment values before the service-specific `.env` file.
  process.chdir(resolve(__dirname, '../../../../../../'));
  dotenv.config();
  process.chdir(TEST_EXEC_ROOT);
  dotenv.config();
  const defaultOverrides: Dict<string> = {
    NODE_ENV: 'test',
    LOG_LEVEL: 'DEBUG',
    SERVICE_ID: `${process.env.SERVICE_ID}_test`,
    DATABASE_NAME: createTestDbIdentifier(
      process.env.DATABASE_NAME,
      testFilePath,
    ),
    DATABASE_OWNER: createTestDbIdentifier(process.env.DATABASE_OWNER),
    DATABASE_LOGIN: createTestDbIdentifier(process.env.DATABASE_LOGIN),
    DATABASE_GQL_ROLE: createTestDbIdentifier(process.env.DATABASE_GQL_ROLE),
  };

  return getFullConfig({
    ...process.env,
    ...defaultOverrides,
    ...overrides,
  });
};
