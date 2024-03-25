import {
  isNullOrWhitespace,
  Logger,
  MosaicError,
  mosaicErrorMappingFactory,
  MosaicErrors,
  removeAnsiColorEscapeCodes,
} from '@axinom/mosaic-service-common';
import { updateDatabase } from 'geoip-country';
import { Config, GEOLITE2_DOWNLOAD_URL, GEOLITE2_LICENSE_KEY } from './common';

/**
 * Returns an error to be thrown in case initial (startup) geo database update attempt fails.
 */
const handleStartupUpdateError = mosaicErrorMappingFactory<{
  stdout?: string;
  stderr?: string;
  reason: string;
}>((error: Error & { stdout?: string; stderr?: string }, context) => {
  return new MosaicError({
    error,
    message: `An error occurred while trying to update geo database. Reason: ${context?.reason}`,
    code: MosaicErrors.StartupError.code,
    details: {
      stdout: removeAnsiColorEscapeCodes(context?.stdout ?? error?.stdout),
      stderr: removeAnsiColorEscapeCodes(context?.stderr ?? error?.stderr),
    },
  });
});

/**
 * Logs an error in case when scheduled geo database update fails.
 * Also stops geo database files watch mode.
 * Does not stop the service. Instead, this log type should be monitored and resolved as soon as possible.
 */
const handleScheduledUpdateError = (
  error: Error,
  stdout: string,
  stderr: string,
  logger: Logger,
): void => {
  logger.error(error, {
    message: `An error occurred while trying to update geo database. Please make sure that '${GEOLITE2_LICENSE_KEY}' env variable is still valid. Check the logged stdout output for more information or contact the entitlement service maintainers for assistance.`,
    details: {
      code: 'SCHEDULED_GEO_DB_UPDATE_FAILED',
      stdout: removeAnsiColorEscapeCodes(stdout),
      stderr: removeAnsiColorEscapeCodes(stderr),
    },
  });
};

const successMessage = 'Geo databases successfully updated!';

/**
 * Schedules an update of geo database to happen every day after service startup.
 * In case of update failure - error is logged and should be explicitly monitored, but the service will continue using old version of geo database.
 */
const scheduleUpdate = (config: Config, logger: Logger): void => {
  setInterval(async () => {
    try {
      updateDatabase(config.geolite2LicenseKey, (error, stdout, stderr) => {
        if (error) {
          handleScheduledUpdateError(error, stdout, stderr, logger);
        } else {
          logger.log(successMessage);
        }
      });
    } catch (err) {
      const error = err as Error & { stdout: string; stderr: string };
      handleScheduledUpdateError(error, error.stdout, error.stderr, logger);
    }
  }, 86400000); // 1 day interval
};

/**
 * Performs a geo database update and schedules recurring updates to happen every day.
 * During development, we will not require the license key/download URL, but will produce a warning on startup to keep the GEO databases up-to-date.
 */
export const updateGeoDatabase = async (config: Config): Promise<void> => {
  const logger = new Logger({ config, context: updateGeoDatabase.name });
  try {
    if (
      config.isDev &&
      isNullOrWhitespace(config.geolite2LicenseKey) &&
      isNullOrWhitespace(config.geolite2DownloadUrl)
    ) {
      logger.warn(
        `The '${GEOLITE2_LICENSE_KEY}' or '${GEOLITE2_DOWNLOAD_URL}' env variables are not set. The GEO location databases might be outdated! Please make sure to update the 'geoip-country' npm package at least once every 30 days or enable automatic database updates by setting an env variable for the license key.`,
      );
      return;
    }

    updateDatabase(config.geolite2LicenseKey, (error, stdout, stderr) => {
      if (error) {
        throw handleStartupUpdateError(error, {
          stdout,
          stderr,
          reason: 'Database update call returned a callback error.',
        });
      } else {
        logger.log(successMessage);
        scheduleUpdate(config, logger);
      }
    });
  } catch (err) {
    throw handleStartupUpdateError(err, {
      reason: 'An unhandled error was thrown.',
    });
  }
};
