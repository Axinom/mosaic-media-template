import {
  compareMigrationHashes,
  createMigrationsLogger,
  MigrationRecord,
} from '@axinom/mosaic-db-common';
import {
  Dict,
  Logger,
  MosaicError,
  mosaicErrorMappingFactory,
  MosaicErrors,
} from '@axinom/mosaic-service-common';
import { migrate } from 'graphile-migrate';
import { Config } from '../config';
import { getMigrationSettings } from './migration-settings';

const getMappedMigrationsError = mosaicErrorMappingFactory((_error: Error) => {
  return {
    message: 'An error occurred while trying to apply migrations.',
    code: MosaicErrors.StartupError.code,
  };
});

export const applyMigrations = async (config: Config): Promise<void> => {
  const logger = new Logger({ context: 'Migrations' });
  // Migrate to the latest committed state if we are in a non-dev environment.
  if (!config.isDev) {
    try {
      const settings = await getMigrationSettings(
        config,
        createMigrationsLogger(logger),
      );
      await compareMigrationHashes(
        settings,
        (message: string, mismatchedRecords?: MigrationRecord[]): void => {
          const details: Dict<unknown> = {};
          if (mismatchedRecords) {
            mismatchedRecords.map((rec) => {
              details[rec.filename] = rec;
            });
          }
          throw new MosaicError({
            message,
            code: MosaicErrors.StartupError.code,
            details,
          });
        },
      );
      await migrate(settings);
    } catch (error) {
      throw getMappedMigrationsError(error);
    }
  } else {
    logger.debug(
      `Skipping migrations. This is a dev environment, assuming graphile-migrate is running in watch mode.`,
    );
  }
};
