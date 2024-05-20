import { Logger } from '@axinom/mosaic-service-common';
import * as maxmind from 'maxmind';
import { CityResponse } from 'maxmind';
import path from 'path';
import { getFullConfig } from '../config';

const config = getFullConfig();

export class GeoIPService {
  private logger = new Logger({
    config,
    context: GeoIPService.name,
  });
  private static instance: GeoIPService;
  private lookup: maxmind.Reader<CityResponse> | null = null;

  static getInstance(): GeoIPService {
    if (!GeoIPService.instance) {
      GeoIPService.instance = new GeoIPService();
    }
    return GeoIPService.instance;
  }

  async loadDatabase(): Promise<void> {
    try {
      this.lookup = await maxmind.open<CityResponse>(
        path.resolve(__dirname, config.geoIP2DatabasePath || ''),
      );
      this.logger.log('GeoIP database loaded successfully..');
    } catch (error) {
      this.logger.error({
        name: 'GeoIP database loading failed',
        message: (error as Error).message,
      });
    }
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
