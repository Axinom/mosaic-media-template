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
    let clientIP = 'ZZ';
    let ipList: string[] = [];

    const xForwardedFor =
      req.headers[config.clientIPHeaderName || 'X-FORWARDED-FOR'];

    logger.warn({
      name: 'Country determining failed',
      message: `Country not found for IP xForwardedFor::: ${xForwardedFor} :::: ${typeof xForwardedFor}`,
    });

    if (typeof xForwardedFor === 'string') {
      ipList = xForwardedFor.split(',').map((ip) => ip.trim());
    } else {
      logger.warn({
        name: 'Country determining failed',
        message: `Country not found for IP::: ${clientIP} ${JSON.stringify(
          req.headers,
          null,
          2,
        )}`,
      });
    }

    if (ipList.length > 0) {
      clientIP = ipList[0];
    }

    const countryInfo = GeoIPService.getInstance().getCity(clientIP || '');
    if (!countryInfo?.country?.iso_code) {
      logger.warn({
        name: 'Country determining failed',
        message: `Country not found for IP::: ${clientIP} ${JSON.stringify(
          req.headers,
          null,
          2,
        )}`,
      });
    }
    return countryInfo?.country?.iso_code || 'ZZU';
  } catch (error) {
    logger.debug({
      name: 'Country determining failed',
      message: `Failed to load the GeoIP database: ${error}`,
    });
    return 'ZZE';
  }
};
