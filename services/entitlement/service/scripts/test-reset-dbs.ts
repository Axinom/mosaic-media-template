#!/usr/bin/env ts-node-script
/* eslint-disable no-console */
import { resolve } from 'path';
import {
  createTestDbs,
  CustomizableDbTestConfig,
  recreateTestDbTemplate,
} from '../../../../scripts/helpers';
import { getMigrationSettings } from '../src/common';
import { createTestConfig } from '../src/tests/test-utils';

async function main(): Promise<void> {
  //Find all test files which rely on test databases using *.db.spec.* file naming convention
  const projectRoot = resolve(__dirname, '../');

  // Create a config to retrieve a root connection string and base db and root names
  const testConfig = createTestConfig();
  const testDbConfig: CustomizableDbTestConfig = {
    ...testConfig,
    originalDbName: process.env.DATABASE_NAME as string, // Config validation has already happened by this point.
  };

  const migrationSettings = await getMigrationSettings(testConfig);
  await recreateTestDbTemplate(testDbConfig, migrationSettings);
  await createTestDbs(testDbConfig, projectRoot, migrationSettings);
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
