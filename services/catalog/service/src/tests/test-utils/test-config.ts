import { createTestDbIdentifier, Dict } from '@axinom/mosaic-service-common';
import * as dotenv from 'dotenv';
import { join, resolve } from 'path';
import { Config, getFullConfig } from '../../common';

// This is needed if tests are running from monorepo context instead of project context, e.g. using Jest Runner extension
export const TEST_EXEC_ROOT = join(__dirname, '..', '..', '..');

export const createTestConfig = (
  overrides: Dict<string> = {},
  testFilePath?: string,
): Config => {
  // TODO: Done to support debugging. Review in-code config load when this issue is resolved: https://github.com/firsttris/vscode-jest-runner/issues/166
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
