/* eslint-disable no-console */

/**
 * This script is to import data dumps into Mosaic Databases.
 * Make sure db:reset is run and all databases/tables are created before running this script.
 * The script looks at the `data-dump` folder at the root of the project and imports the data into the respective databases.
 *
 * Run the file using the following command from Mosaic Media Template root.
 *
 * `yarn run env-cmd --silent -f .env ts-node scripts/import-pg-dump.ts`
 */

import { execSync } from 'child_process';
import { Client } from 'pg';

async function generateDeferrableConstraintDdls(
  database: string,
): Promise<{ dropConstraintDdls: string[]; createConstraintDdls: string[] }> {
  const client = new Client({
    user: process.env.POSTGRESQL_ROOT,
    host: 'localhost',
    database: database,
    password: process.env.POSTGRESQL_ROOT_PASSWORD,
    port: Number(process.env.POSTGRESQL_PORT),
  });

  await client.connect();

  // Get deferrable constraints
  const { rows } = await client.query(
    `
    SELECT 
        'ALTER TABLE ' || nspname ||'.'|| conrelid::regclass::text || 
        ' DROP CONSTRAINT IF EXISTS ' || conname || ';' AS drop_ddl,
        'ALTER TABLE ' || nspname ||'.'|| conrelid::regclass::text || 
        ' ADD CONSTRAINT ' || conname || 
        ' ' || pg_get_constraintdef(c.oid) || ';' AS create_ddl
    FROM 
        pg_constraint c
    JOIN 
        pg_namespace n ON n.oid = c.connamespace
    WHERE 
        condeferrable = TRUE;`,
  );

  const dropConstraintDdls: string[] = [];
  const createConstraintDdls: string[] = [];

  for (const row of rows) {
    dropConstraintDdls.push(row.drop_ddl);
    createConstraintDdls.push(row.create_ddl);
  }

  await client.end();

  return { dropConstraintDdls, createConstraintDdls };
}

async function importDump(dumpFile: string): Promise<void> {
  const targetDatabase = dumpFile.split('.')[0];
  const { dropConstraintDdls, createConstraintDdls } =
    await generateDeferrableConstraintDdls(targetDatabase);

  const composePath = `${process.cwd()}/infra`;
  const dumpPath = `${process.cwd()}/data-dump/${dumpFile}`;
  const connectionString = `postgresql://${process.env.POSTGRESQL_ROOT}:${process.env.POSTGRESQL_ROOT_PASSWORD}@localhost:${process.env.POSTGRESQL_PORT}`;

  const importCommand = `cd ${composePath} && docker-compose exec -T postgres psql -d ${connectionString}/${targetDatabase} < ${dumpPath}`;

  /**
   * Note:
   * We need to drop any deferrable constraints when importing data since it does not support ON CONFLICT DO NOTHING.
   * We re-create any dropped constraints after the data is imported.
   */
  try {
    console.log(`Importing data to ${targetDatabase}...`);
    if (dropConstraintDdls.length > 0) {
      for (const dropConstraintDdl of dropConstraintDdls) {
        const constraintName = dropConstraintDdl
          .split('DROP CONSTRAINT IF EXISTS ')[1]
          .split(';')[0];
        try {
          console.log(
            `Temporarily dropping deferrable constraint: `,
            constraintName,
          );
          const dropConstraintCommand = `cd ${composePath} && docker-compose exec -T postgres psql -d ${connectionString}/${targetDatabase} -c "${dropConstraintDdl}"`;
          execSync(dropConstraintCommand);
        } catch (error) {
          console.error(
            `Error dropping constraint ${constraintName} in ${targetDatabase}: ${
              (error as Error).message
            }`,
          );
        }
      }
    }
    execSync(importCommand);

    if (createConstraintDdls.length > 0) {
      for (const createConstraintDdl of createConstraintDdls) {
        const constraintName = createConstraintDdl
          .split('ADD CONSTRAINT ')[1]
          .split(' UNIQUE')[0];
        try {
          const createConstraintCommand = `cd ${composePath} && docker-compose exec -T postgres psql -d ${connectionString}/${targetDatabase} -c "${createConstraintDdl}"`;
          execSync(createConstraintCommand);
          console.log(
            'Recreated temporarily dropped deferrable constraint: ',
            constraintName,
          );
        } catch (error) {
          console.error(
            `Error creating constraint ${constraintName} in ${targetDatabase}: ${
              (error as Error).message
            }`,
          );
        }
      }
    }
    console.log(`Data imported to ${targetDatabase} successfully.`);
  } catch (error) {
    console.log(error);
    console.error(
      `Error importing data to ${targetDatabase}: ${(error as Error).message}`,
    );
  }
}

async function importData(): Promise<void> {
  const dumpFiles = readDumpFiles();
  for (const dumpFile of dumpFiles) {
    if (dumpFile === '') {
      continue;
    }
    await importDump(dumpFile);
  }
}

function readDumpFiles(): string[] {
  const dumpPath = `${process.cwd()}/data-dump`;
  return execSync(`ls ${dumpPath}`).toString().split('\n');
}

importData();
