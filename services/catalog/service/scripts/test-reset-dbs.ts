#!/usr/bin/env ts-node-script
/* eslint-disable no-console */
import { reset } from 'graphile-migrate';
import { resolve } from 'path';
import * as readdir from 'readdirp';
import {
  dropDatabasesAndRoles,
  initializePgPool,
  runResetQueries,
} from '../../../../scripts/helpers';
import { getMigrationSettings } from '../src/common';
import { createTestConfig } from '../src/tests/test-utils/test-config'; //Important not to load everything from test-utils, which includes postgraphile options which ts-node ignores custom types for and breaks

async function main(): Promise<void> {
  //Find all test files which rely on test databases using *.db.spec.* file naming convention
  const dirPath = resolve(__dirname, '../');
  const testPaths = (
    await readdir.promise(dirPath, { fileFilter: '*.db.spec.*' })
  ).map((info) => info.fullPath);

  // Create a config to retrieve a root connection string and base db and root names
  const config = createTestConfig();

  const rootPgPool = await initializePgPool(config.pgRootConnectionString);

  //Drop all existing test databases and related roles
  await dropDatabasesAndRoles(
    rootPgPool,
    config.dbName,
    config.dbGqlRole,
    config.dbLogin,
    config.dbOwner,
  );

  await rootPgPool.end();
  console.log('---------------------------------------------');

  // (Re-)create a test database with related roles for each '.db.spec.' file
  for (const path of testPaths) {
    const testConfig = createTestConfig({}, path);

    const rootPgPool = await initializePgPool(config.pgRootConnectionString);

    await runResetQueries(
      rootPgPool,
      testConfig.dbName,
      testConfig.dbGqlRole,
      testConfig.dbLogin,
      testConfig.dbLoginPassword,
      testConfig.dbOwner,
      testConfig.dbOwnerPassword,
    );

    await rootPgPool.end();

    // Reset database, so that after-reset scripts are executed using root credentials
    // This is needed because after-reset scripts usually install pg extensions, which requires permissions that root user should have (e.g superuser).
    const settings = await getMigrationSettings(testConfig);
    await reset(settings);

    console.log('---------------------------------------------');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
