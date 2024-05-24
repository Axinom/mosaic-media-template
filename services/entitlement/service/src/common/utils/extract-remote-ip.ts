import { Logger } from '@axinom/mosaic-service-common';
import { Request } from 'express';
import { getFullConfig } from '../config';
import { GeoIPService } from '../services';

const config = getFullConfig();

export const extractCountryCodeFromRemoteIP = async (
  req: Request,
): Promise<string> => {
  const logger = new Logger({
    config,
    context: extractCountryCodeFromRemoteIP.name,
  });
  try {
    const clientIP = req.ip ? req.ip.trim() : 'ZZ';
    const countryInfo = GeoIPService.getInstance().getCity(clientIP);
    if (!countryInfo?.country?.iso_code) {
      logger.warn({
        name: 'Country determining failed',
        message: `Country not found for IP ::: ${clientIP} Headers ::: ${JSON.stringify(
          req.headers,
          null,
          2,
        )}`,
      });
    }
    return countryInfo?.country?.iso_code || 'ZZ';
  } catch (error) {
    logger.debug({
      name: 'Country determining failed',
      message: `Failed to load the GeoIP database: ${error}`,
    });
    return 'ZZE';
  }
};
