import {
  createTestDbIdentifier,
  Dict,
  getValidatedConfig,
} from '@axinom/mosaic-service-common';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { Config, getConfigDefinitions } from '../../common/config';

export const createTestConfig = (
  overrides: Dict<string> = {},
  testFilePath?: string,
): Config => {
  // Load monorepo environment values before the service-specific `.env` file.
  process.chdir(resolve(__dirname, '../../../../../../'));
  dotenv.config();

  // Normalize process.cwd() to the service root before loading its environment.
  process.chdir(resolve(__dirname, '../../../'));
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
    IS_LOCALIZATION_ENABLED: 'TRUE',
  };

  return getValidatedConfig(
    getConfigDefinitions({
      ...process.env,
      ...defaultOverrides,
      ...overrides,
    }),
  );
};
