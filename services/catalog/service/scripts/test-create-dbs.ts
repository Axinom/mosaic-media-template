/* eslint-disable no-console */
import { reset } from 'graphile-migrate';
import { resolve } from 'path';
import * as readdir from 'readdirp';
import { initializePgPool, runResetQueries } from '../../../../scripts/helpers';
import { getMigrationSettings } from '../src/common';
import { createTestConfig } from '../src/tests/test-utils';

// Creates test databases for newly created (or moved) .db.spec. files
async function main(): Promise<void> {
  // Create a config to retrieve a root connection string and base db
  const config = createTestConfig();

  // Get all existing test database names
  const rootPgPool = await initializePgPool(config.pgRootConnectionString);
  const existingDatabases = (
    await rootPgPool.query(
      `SELECT datname FROM pg_database WHERE datname LIKE '${config.dbName}%';`,
    )
  ).rows.map((r) => r.datname);
  await rootPgPool.end();

  //Find all test files which rely on test databases using *.db.spec.* file
  //naming convention and generate resulting database configs, to find only
  //the databases that must be added.
  const dirPath = resolve(__dirname, '../');
  const testConfigs = (
    await readdir.promise(dirPath, { fileFilter: '*.db.spec.*' })
  ).map((info) => createTestConfig({}, info.fullPath));

  // Get a list of new databases to be added
  const configsForDatabasesToAdd = testConfigs.filter(
    (testConfig) => !existingDatabases.includes(testConfig.dbName),
  );

  if (configsForDatabasesToAdd.length === 0) {
    console.log('No new test databases to create.');
    return;
  }

  // Create a new test database with related roles for each '.db.spec.' file that does not have a DB yet
  for (const testConfig of configsForDatabasesToAdd) {
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
