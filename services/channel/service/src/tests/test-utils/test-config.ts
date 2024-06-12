import { createTestDbIdentifier, Dict } from '@axinom/mosaic-service-common';
import { Config, getFullConfig } from '../../common/config';

export const createTestConfig = (
  overrides: Dict<string> = {},
  testFilePath?: string,
): Config => {
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
    VIDEO_SERVICE_BASE_URL: 'https://test-video-service.com',
  };

  return getFullConfig({
    ...process.env,
    ...defaultOverrides,
    ...overrides,
  });
};
