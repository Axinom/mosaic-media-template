import { Logger } from '@axinom/mosaic-service-common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { CronJob } from 'cron';
import fs from 'fs';
import * as maxmind from 'maxmind';
import { CityResponse } from 'maxmind';
import path from 'path';
import { getFullConfig } from '../config';

const config = getFullConfig();

export class GeoIPService {
  private readonly localFilename = 'GeoLite2-City.mmdb';
  private readonly geoIP2LoadRetryIntervalMinutes = 1;
  private readonly geoIP2LoadRetryIntervalMaxAttempts = 10;

  private logger = new Logger({
    config,
    context: GeoIPService.name,
  });
  private static instance: GeoIPService;
  private lookup: maxmind.Reader<CityResponse> | null = null;
  private loaderIsRunning = false;

  static getInstance(): GeoIPService {
    if (!GeoIPService.instance) {
      GeoIPService.instance = new GeoIPService();
    }
    return GeoIPService.instance;
  }

  async downloadFileFromAzure(
    sasUrl: string,
    container: string,
    blob: string,
    localFilename: string,
  ): Promise<void> {
    const client = new BlobServiceClient(sasUrl);
    const containerClient = client.getContainerClient(container);
    const blockBlobClient: BlockBlobClient =
      containerClient.getBlockBlobClient(blob);
    const localPath = path.resolve(__dirname, localFilename);
    const tmpPath = path.resolve(__dirname, `tmp_${localFilename}`);
    await blockBlobClient.downloadToFile(tmpPath);
    fs.renameSync(tmpPath, localPath);
  }

  async tryLoadDatabase(force = false, attempt = 0): Promise<void> {
    if (this.loaderIsRunning && !force) {
      return;
    }
    this.loaderIsRunning = true;
    try {
      this.logger.log('Loading GeoIP database ..');
      await this.downloadFileFromAzure(
        config.geoIP2BlobStorageURL,
        config.geoIP2BlobContainer,
        config.geoIP2DatabaseFile,
        this.localFilename,
      );
      this.lookup = await maxmind.open<CityResponse>(
        path.resolve(__dirname, this.localFilename),
      );
      this.logger.log('GeoIP database loaded successfully..');
      this.loaderIsRunning = false;
    } catch (error) {
      this.logger.error({
        name: 'GeoIP database loading failed',
        message: (error as Error).message,
      });
      if (attempt < this.geoIP2LoadRetryIntervalMaxAttempts - 1) {
        setTimeout(
          () => this.tryLoadDatabase(true, attempt + 1),
          this.geoIP2LoadRetryIntervalMinutes * 60000,
        );
      }
      this.loaderIsRunning = false;
    }
  }

  startDatabaseUpdater() {
    this.tryLoadDatabase(false, 0);
    new CronJob(
      config.geoIP2UpdateSchedule,
      () => this.tryLoadDatabase(false, 0),
      null,
      true,
    );
  }

  getCity(ip: string): any {
    if (this.lookup) {
      return this.lookup.get(ip);
    } else {
      this.logger.error({
        name: 'GeoIP database not loaded',
        message: 'GeoIP database is not loaded or lookup is not initialized.',
      });
      return null;
    }
  }
}
