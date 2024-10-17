/* eslint-disable no-console */

/**
 * This script is to create a data only dumps from the existing Mosaic databases.
 * The scripts exports dump files to the data-dump folder at the root of the project.
 *
 * Run the file using the following command from Mosaic Media Template root.
 *
 * `yarn run env-cmd --silent -f .env ts-node scripts/create-data-dump.ts`
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';

const ensureDumpDirectoryExist = (targetPath: string): string => {
  const dbSchemaExportPath = join(process.cwd(), targetPath);
  const dirPath = dirname(dbSchemaExportPath);
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
  return dbSchemaExportPath;
};

const createDump = async (databaseName: string): Promise<void> => {
  const dumpDirectory = `data-dump`;
  try {
    const connectionString = `postgresql://${process.env.POSTGRESQL_ROOT}:${process.env.POSTGRESQL_ROOT_PASSWORD}@host.docker.internal:${process.env.POSTGRESQL_PORT}/${databaseName}`;
    console.log(`Connecting to: `, connectionString);
    const dumpPath = ensureDumpDirectoryExist(
      `${dumpDirectory}/${databaseName}.sql`,
    );

    const dumpOptions = [
      '--data-only',
      '--column-inserts',
      '--disable-triggers',
      '--on-conflict-do-nothing',
      '--exclude-schema=graphile_migrate',
      '--exclude-schema=ax_define',
      '--exclude-schema=ax_utils',
      '--exclude-schema=graphile_worker',
      connectionString,
    ].join(' ');

    console.log(`Starting pg-dump command for `, databaseName);
    execSync(
      `docker run --rm --add-host=host.docker.internal:host-gateway postgres:16.2-alpine pg_dump ${dumpOptions} > ${dumpPath}`,
    );
    console.log('Dump file ready at: ', dumpPath);
  } catch (e) {
    console.log('Command failed:', (e as Error).message);
    process.exit(1);
  }
};

function exportData(databases: string[]): void {
  for (const database of databases) {
    createDump(database);
  }
}

const databases: string[] = [];

function traverseEnvFiles(directory: string): string[] {
  const files: string[] = [];

  const entries = readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...traverseEnvFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.env.template')) {
      const databaseName = getDatabaseName(fullPath);
      if (databaseName !== undefined) {
        databases.push(databaseName);
        break;
      }
      files.push(fullPath);
    }
  }

  return files;
}

function getDatabaseName(filePath: string): string | undefined {
  const fileContent = readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');
  for (const line of lines) {
    if (line.startsWith('DATABASE_NAME=')) {
      return line.split('=')[1].trim();
    }
  }
  return undefined;
}

const serviceDirectory = join(process.cwd(), 'services');
traverseEnvFiles(serviceDirectory);

exportData(databases);
