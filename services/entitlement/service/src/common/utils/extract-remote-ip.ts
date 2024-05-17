import { Request } from 'express';
import { getFullConfig } from '../config';
import { GeoIPService } from '../services';

const config = getFullConfig();

export const extractCountryCodeFromRemoteIP = async (
  req: Request,
): Promise<string> => {
  try {
    const forwarded = req.headers[
      config.clientIPHeaderName || 'x-forwarded-for'
    ] as string[];
    const clientIP = forwarded ? forwarded[0] : req.connection.remoteAddress;
    const countryInfo = GeoIPService.getInstance().getCity(clientIP || '');
    return countryInfo?.country?.iso_code || 'ZZ';
  } catch (error) {
    // Todo: remove console.log with proper logger.
    console.error('Failed to load the GeoIP database:', error);
    return 'ZZ';
  }
};
