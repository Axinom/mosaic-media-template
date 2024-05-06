import {
  DEFAULT_DB_USERNAME,
  getBeforeMigrationScripts,
  getGraphileBuildPgWatchFixturesPath,
} from '@axinom/mosaic-db-common';
import { Logger as MigrateLogger, Settings } from 'graphile-migrate';
import { DbConfig } from '../config';
import { DEFAULT_LOCALE_TAG, MOSAIC_LOCALE_PG_KEY } from '../constants';

export const getMigrationSettings = async (
  config: DbConfig,
  logger?: MigrateLogger,
): Promise<Settings> => {
  const beforeAllMigrationsAndCurrent = await getBeforeMigrationScripts();
  return {
    logger,
    connectionString: config.dbOwnerConnectionString,
    shadowConnectionString: config.dbShadowConnectionString,
    rootConnectionString: config.pgRootConnectionString,
    pgSettings: {
      search_path: 'app_public,app_private,ax_utils,public',
    },
    placeholders: {
      // :DATABASE_NAME and :DATABASE_OWNER are restricted and shall not be defined here
      ':DB_NAME': config.dbName,
      ':DB_OWNER': config.dbOwner,
      ':DATABASE_LOGIN': config.dbLogin,
      ':DATABASE_GQL_ROLE': config.dbGqlRole,
      ':DEFAULT_USERNAME': DEFAULT_DB_USERNAME,
      ':DEFAULT_LOCALE_TAG': DEFAULT_LOCALE_TAG,
      ':MOSAIC_LOCALE': MOSAIC_LOCALE_PG_KEY,
    },
    afterReset: [
      {
        _: 'sql',
        file: 'after-reset/install-extensions.sql',
        root: true,
      },
      {
        _: 'sql',
        file: getGraphileBuildPgWatchFixturesPath(),
        root: true,
      },
    ],
    beforeAllMigrations: beforeAllMigrationsAndCurrent,
    afterAllMigrations: [
      {
        _: 'command',
        shadow: true,
        command: 'yarn util:pg-dump',
      },
      {
        _: 'command',
        shadow: true,
        command: `yarn internal:zapatos:committed`,
      },
    ],
    beforeCurrent: beforeAllMigrationsAndCurrent,
    afterCurrent: [
      // This will only run when NODE_ENV is 'development'
      {
        _: 'command',
        shadow: false,
        command: `yarn internal:zapatos`,
      },
    ],
    blankMigrationContent: `
--! Message: replace-with-migration-name

-- Remove this comment line and write your migration here. Make sure to keep one empty line between 'Message' header and first migration line to properly name future migration file.
`,
  };
};
