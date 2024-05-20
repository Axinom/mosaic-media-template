import { Request } from 'express';
import { getFullConfig } from '../config';
import { GeoIPService } from '../services';
import { Logger } from '@axinom/mosaic-service-common';

const config = getFullConfig();

export const extractCountryCodeFromRemoteIP = async (
  req: Request,
): Promise<string> => {
  const logger = new Logger({
    config,
    context: extractCountryCodeFromRemoteIP.name,
  });
  try {
    const forwarded = req.headers[
      config.clientIPHeaderName || 'x-forwarded-for'
    ] as string[];
    const clientIP = forwarded ? forwarded[0] : req.connection.remoteAddress;
    const countryInfo = GeoIPService.getInstance().getCity(clientIP || '');
    return countryInfo?.country?.iso_code || 'ZZ';
  } catch (error) {
    logger.debug({
      name: 'Country determining failed',
      message: `Failed to load the GeoIP database: ${error}`,
    });
    return 'ZZ';
  }
};
