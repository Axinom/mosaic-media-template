import { ensureError, Logger } from '@axinom/mosaic-service-common';
import { BlockBlobClient } from '@azure/storage-blob';
import { existsSync, renameSync } from 'fs';
import { CountryResponse, open, Reader } from 'maxmind';
import cron from 'node-cron';
import path from 'path';
import { CommonErrors, Config } from '../common';

const logger = new Logger({
  context: 'MaxMindUtils',
});

export interface GeoIpReaderContainer {
  reader: Reader<CountryResponse>;
}

async function downloadFileFromAzure(
  sasUrl: string,
  localFileName: string,
): Promise<Buffer | void> {
  try {
    const filePath = path.resolve(__dirname, localFileName);
    const tempFilePath = path.resolve(__dirname, `tmp_${localFileName}`);
    // Create a BlockBlobClient directly from the SAS URL
    const blockBlobClient = new BlockBlobClient(sasUrl);

    // DownloadToFile function doesn't support file re-writes.
    // So we need to take care of it manually.
    logger.debug(`Starting GeoIP2 Database download from Azure Blob`);
    await blockBlobClient.downloadToFile(tempFilePath);
    renameSync(tempFilePath, filePath);
    logger.debug(
      `GeoIP2 Database downloaded successfully from Azure Blob to ${filePath}`,
    );
    return;
  } catch (err) {
    const error = ensureError(err);
    logger.error(error, CommonErrors.GeoIpDbDownloadFailed.message);
    throw error;
  }
}

export const initGeoIpService = async (
  config: Config,
): Promise<GeoIpReaderContainer> => {
  const sasUrl = `https://${config.geoIP2StorageAccount}.blob.core.windows.net/${config.geoIP2BlobContainer}/${config.geoIP2DatabaseFile}?${config.geoIP2SASToken}`;
  const localFileName = 'GeoIP2-city.mmdb';

  const filePath = path.resolve(__dirname, localFileName);
  if ((config.isDev && !existsSync(filePath)) || !config.isDev) {
    await downloadFileFromAzure(sasUrl, localFileName);
  }

  const readerContainer = {
    reader: await open<CountryResponse>(path.resolve(__dirname, localFileName)),
  };

  // Schedule a task to run every day
  cron.schedule(config.geoIP2UpdateSchedule, async () => {
    try {
      logger.debug('Starting GeoIP database refresh.');
      await downloadFileFromAzure(sasUrl, localFileName);
      // Reload the database
      readerContainer.reader = await open<CountryResponse>(
        path.resolve(__dirname, localFileName),
      );
      logger.debug('GeoIP database refreshed successfully');
    } catch (err) {
      const error = ensureError(err);
      logger.error(error, CommonErrors.GeoIpRefreshFailed.message);
    }
  });
  return readerContainer;
};
