/* eslint-disable no-console */
import {
  createTestDbIdentifier,
  getBasicDbConfigDefinitions,
  ValueObject,
} from '@axinom/mosaic-service-common';
import fs from 'fs';
import { compile, reset, Settings } from 'graphile-migrate';
import { join } from 'path';
import { Pool } from 'pg';
import readdir from 'readdirp';
import {
  dropDatabasesAndRoles,
  initializePgPool,
  runResetQueries,
} from './db-command-helpers';

/** Placeholder for DB name in graphile-migrate migrations. */
const dbNamePlaceholder = ':DB_NAME';

/** Extension interface for the application's config object. */
interface DbTestConfig {
  /** Original DB name as it would be in prod, before any test specific transformations are applied. */
  originalDbName: string;
}

type BasicDbConfig = ValueObject<
  ReturnType<typeof getBasicDbConfigDefinitions>
>;

type MinimalDbConfig = Omit<
  BasicDbConfig,
  'dbLogin' | 'dbLoginPassword' | 'dbLoginConnectionString' | 'dbGqlRole'
>;

export type CustomizableDbTestConfig = BasicDbConfig & DbTestConfig;

export type MinimalDbTestConfig = MinimalDbConfig & DbTestConfig;

/**
 * Drops existing test databases and creates a test DB template.
 */
export async function recreateTestDbTemplate(
  dbConfig: CustomizableDbTestConfig,
  migrationSettings: Settings,
): Promise<void> {
  const rootPgPool = await initializePgPool(dbConfig.pgRootConnectionString);

  //Drop all existing test databases and related roles
  await dropDatabasesAndRoles(
    rootPgPool,
    dbConfig.dbName,
    dbConfig.dbGqlRole,
    dbConfig.dbLogin,
    dbConfig.dbOwner,
  );
  console.log('---------------------------------------------');

  // Create the template test DB
  await runResetQueries(
    rootPgPool,
    dbConfig.dbName,
    dbConfig.dbGqlRole,
    dbConfig.dbLogin,
    dbConfig.dbLoginPassword,
    dbConfig.dbOwner,
    dbConfig.dbOwnerPassword,
    true,
    dbConfig.pgRoot,
  );

  await rootPgPool.end();
  console.log('---------------------------------------------');

  await reset(migrationSettings);
  console.log('---------------------------------------------');
}

/**
 * Creates test databases, one for each `*.db.spec.*` file.
 */
export async function createTestDbs(
  dbConfig: MinimalDbTestConfig,
  projectRoot: string,
  migrationSettings: Settings,
): Promise<void> {
  //Find all test files which rely on test databases using *.db.spec.* file naming convention
  const testPaths = (
    await readdir.promise(projectRoot, { fileFilter: '*.db.spec.*' })
  ).map((info) => info.fullPath);

  console.log(`Creating ${testPaths.length} test databases.`);

  const dbStatementsSql = scanMigrations(
    join(projectRoot, 'migrations', 'committed'),
  ).join('\n');

  const dbCreations: Promise<string>[] = [];

  // (Re-)create a test databases with related roles for each '.db.spec.' file
  const rootPgPool = await initializePgPool(dbConfig.pgRootConnectionString);
  for (const path of testPaths) {
    // We can parallelize DB creation as there are no connections to this template DB.
    dbCreations.push(
      createTestDb(
        rootPgPool,
        dbConfig,
        path,
        dbStatementsSql,
        migrationSettings,
      ),
    );
  }

  // Wait until all DBs are created.
  const createdTestDbs = await Promise.all(dbCreations);

  console.log('Created following test databases:');
  console.log(createdTestDbs.join('\n'));

  await rootPgPool.end();
}

/**
 * Creates a single test DB.
 * @param testPath - path to the `*.db.spec.*` file
 * @param adjustmentSqlTemplate - template for SQL statements to run DB specific (:DB_NAME) statements that were carried over during template cloning, e.g. grants, search_path
 */
export async function createTestDb(
  rootPgPool: Pool,
  dbConfig: MinimalDbTestConfig,
  testPath: string,
  adjustmentSqlTemplate: string,
  migrationSettings: Settings,
): Promise<string> {
  const testDbName = createTestDbIdentifier(dbConfig.originalDbName, testPath);

  // Replace the :DB_NAME placeholder value to match the test database.
  const testMigrationSettings: Settings = {
    ...migrationSettings,
    placeholders: {
      ...migrationSettings.placeholders,
      [dbNamePlaceholder]: testDbName,
    },
  };

  const createTableSql = `CREATE DATABASE ${testDbName} WITH TEMPLATE ${dbConfig.dbName} OWNER ${dbConfig.dbOwner};`;
  const tableSpecificAdjustmentsSql = await compile(
    testMigrationSettings,
    adjustmentSqlTemplate,
  );

  const client = await rootPgPool.connect();
  try {
    await client.query(createTableSql);
    await client.query(tableSpecificAdjustmentsSql);
    return testDbName;
  } finally {
    client.release();
  }
}

/**
 * Scans all migrations and returns SQL statements that contain the :DB_NAME placeholder.
 * @param migrationsDir - path to committed migrations
 */
function scanMigrations(migrationsDir: string): string[] {
  const files = fs.readdirSync(migrationsDir);
  const queries: string[] = [];

  files.forEach((file) => {
    const filePath = join(migrationsDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    // Don't process the file further if there is not a single occurrence of the placeholder.
    if (fileContents.indexOf(dbNamePlaceholder) >= 0) {
      queries.push(...getSqlStatementsWithDbName(fileContents));
    }
  });
  return queries;
}

/**
 * Scans a migrations file for statements that contain the :DB_NAME placeholder.
 * @param fileContents - contents of a single migrations file
 */
export function getSqlStatementsWithDbName(fileContents: string): string[] {
  // We only expect to encounter the placeholder in SQL and not in plpsql, so assuming ';' to be the statement terminator should be fine here.
  const statements = fileContents.split(';');
  return statements
    .filter((l) => l.indexOf(dbNamePlaceholder) >= 0)
    .map((s) => s.trim().concat(';'));
}
