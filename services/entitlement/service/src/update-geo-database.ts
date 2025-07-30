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
import tar from 'tar-stream';
import { promisify } from 'util';
import zlib from 'zlib';
import { Config, GEOLITE2_LICENSE_KEY, MAXMIND_ACCOUNT_ID } from './common';

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

const downloadGeoDb = async (
  accountId: string,
  licenseKey: string,
  downloadUrl: string,
): Promise<void> => {
  const GEO_DB_DEST_DIR = path.join(__dirname, 'data');
  const GEO_DB_DEST = path.join(GEO_DB_DEST_DIR, 'GeoLite2-Country.mmdb');

  if (!fs.existsSync(GEO_DB_DEST_DIR)) {
    fs.mkdirSync(GEO_DB_DEST_DIR, { recursive: true });
  }

  const url = new URL(downloadUrl);
  url.searchParams.set('edition_id', 'GeoLite2-Country');
  url.searchParams.set('suffix', 'tar.gz');
  url.searchParams.set('account_id', accountId);
  url.searchParams.set('license_key', licenseKey);
  const res = await fetch(url.href);

  if (!res.ok) {
    throw new Error(
      `Failed to download Geo DB: ${res.status} ${res.statusText}`,
    );
  }
  const extract = tar.extract();

  extract.on('entry', async (header, stream, next) => {
    if (header.name.endsWith('.mmdb')) {
      const outStream = fs.createWriteStream(GEO_DB_DEST);
      await streamPipeline(stream, outStream);
    } else {
      stream.resume(); // skip other files
    }
    next();
  });

  await streamPipeline(res.body, zlib.createGunzip(), extract);

  if (!fs.existsSync(GEO_DB_DEST)) {
    throw new Error('Extracted .mmdb file not found at expected location.');
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
      isNullOrWhitespace(config.maxmindAccountId)
    ) {
      logger.warn(
        `The '${GEOLITE2_LICENSE_KEY}' or '${MAXMIND_ACCOUNT_ID}' env variables are not set. The GEO location databases might be outdated!`,
      );
      return;
    }

    await downloadGeoDb(
      config.maxmindAccountId,
      config.geolite2LicenseKey,
      config.geolite2DownloadUrl,
    );
    logger.log(successMessage);
    scheduleUpdate(config, logger);
  } catch (err) {
    throw handleStartupUpdateError(err, {
      reason: 'An unhandled error was thrown.',
    });
  }
};
