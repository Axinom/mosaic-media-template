import {
  isNullOrWhitespace,
  Logger,
  MosaicError,
  mosaicErrorMappingFactory,
  MosaicErrors,
  removeAnsiColorEscapeCodes,
} from '@axinom/mosaic-service-common';
import fs from 'fs';
import cron from 'node-cron';
import fetch from 'node-fetch';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import {
  Config,
  GEOLITE2_DOWNLOAD_URL,
  GEOLITE2_LICENSE_KEY,
  MAXMIND_ACCOUNT_ID,
} from './common';

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

const streamPipeline = promisify(pipeline);

const buildGeoLite2DownloadUrl = (
  accountId: string,
  licenseKey: string,
  downloadUrl: string,
): string =>
  `${downloadUrl}edition_id=GeoLite2-Country&suffix=tar.gz&account_id=${accountId}&license_key=${licenseKey}`;

const downloadGeoDb = async (
  accountId: string,
  licenseKey: string,
  downloadUrl: string,
  dataFilePath: string,
): Promise<void> => {
  const DB_DEST = path.join(__dirname, dataFilePath);

  const url = buildGeoLite2DownloadUrl(accountId, licenseKey, downloadUrl);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `Failed to download Geo DB: ${res.status} ${res.statusText}`,
    );
  }
  await streamPipeline(res.body, fs.createWriteStream(DB_DEST));
  if (!fs.existsSync(DB_DEST)) {
    throw new Error('Downloaded Geo DB file not found at expected path.');
  }
};

/**
 * Schedules an update of geo database to happen every day after service startup.
 * In case of update failure - error is logged and should be explicitly monitored, but the service will continue using old version of geo database.
 */
const scheduleUpdate = (config: Config, logger: Logger): void => {
  cron.schedule('0 0 * * *', async () => {
    try {
      await downloadGeoDb(
        config.maxmindAccountId,
        config.geolite2LicenseKey,
        config.geolite2DownloadUrl,
        config.geolite2DataFilePath,
      );
      logger.log(successMessage);
    } catch (error) {
      const err = error as Error & { stdout: string; stderr: string };
      handleScheduledUpdateError(err, err.stdout, err.stderr, logger);
    }
  });
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
      isNullOrWhitespace(config.geolite2DownloadUrl) &&
      isNullOrWhitespace(config.maxmindAccountId)
    ) {
      logger.warn(
        `The '${GEOLITE2_LICENSE_KEY}' or '${GEOLITE2_DOWNLOAD_URL}' or '${MAXMIND_ACCOUNT_ID}' env variables are not set. The GEO location databases might be outdated!`,
      );
      return;
    }

    await downloadGeoDb(
      config.maxmindAccountId,
      config.geolite2LicenseKey,
      config.geolite2DownloadUrl,
      config.geolite2DataFilePath,
    );
    logger.log(successMessage);
    scheduleUpdate(config, logger);
  } catch (err) {
    throw handleStartupUpdateError(err, {
      reason: 'An unhandled error was thrown.',
    });
  }
};
