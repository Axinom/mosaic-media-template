import * as maxmind from 'maxmind';
import { CountryResponse } from 'maxmind';
import { getFullConfig } from '../config';

const config = getFullConfig();

export class GeoIPService {
  private static instance: GeoIPService;
  private lookup: maxmind.Reader<CountryResponse> | null = null;

  static getInstance(): GeoIPService {
    if (!GeoIPService.instance) {
      GeoIPService.instance = new GeoIPService();
    }
    return GeoIPService.instance;
  }

  async loadDatabase(): Promise<void> {
    try {
      this.lookup = await maxmind.open<CountryResponse>(
        config.geoIP2DatabasePath || '',
      );
      // Todo: remove console.log with proper logger.
      console.log('GeoIP database loaded successfully..');
    } catch (error) {
      console.error('Failed to load the GeoIP database:', error);
    }
  }

  getCountry(ip: string): any {
    if (this.lookup) {
      return this.lookup.get(ip);
    } else {
      console.error('GeoIP database is not loaded.');
      return null;
    }
  }
}
