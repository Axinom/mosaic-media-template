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
    GEOLITE2_LICENSE_KEY:
      'Fake value to satisfy required validation, since during tests isDev is false',
    MAXMIND_ACCOUNT_ID:
      'Fake value to satisfy required validation, since during tests isDev is false',
    SECURE_LOGGING_MODE: 'SECRETS_HIDDEN',
    // Tests mock the DRM Service, so these only satisfy the required validation.
    DRM_SERVICE_BASE_URL: 'http://drm-service.test.invalid',
    SERVICE_ACCOUNT_CLIENT_ID: 'test-service-account-client-id',
    SERVICE_ACCOUNT_CLIENT_SECRET: 'test-service-account-client-secret',
  };

  return getValidatedConfig(
    getConfigDefinitions({
      ...process.env,
      ...defaultOverrides,
      ...overrides,
    }),
  );
};
