import { Logger } from '@axinom/mosaic-service-common';
import { Request, Response } from 'express';
import moment from "moment-timezone";
import 'moment-timezone';
import {
  GeoIPService,
  getFullConfig,
} from '../../common';

const config = getFullConfig();

const validateIP = (ipaddress: string) => 
    (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress));

const GetTimeZoneOffset = (timeZone: string): number => {
        if (!timeZone) return 0 
        const offset = moment().tz(timeZone).utcOffset();
        return offset >= 0 ? offset/60 : 0;
}

export const CountryRequestHandling = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const logger = new Logger({
    config,
    context: CountryRequestHandling.name,
  });
  const clientIP = req.query.ip as string;
  if (!validateIP(clientIP)) {
    const msg = `Provided IP address ${clientIP} is empty or invalid`;
    //level == trace, not business-sensitive error, will otherwise flood logging broker
    logger.trace({
        name: 'IP address validation failed',
        message: msg,
      });
      return res.status(400).json({
        message: 'Validation fail',
        errors: [msg],
      });
  }
  const countryInfo = GeoIPService.getInstance().getCity(clientIP || '');
  const subdiv = countryInfo?.subdivisions;
  console.log(` Local : ${subdiv.find(() => true)}`);
  return res.send({
    CountryCode: countryInfo?.country?.iso_code,
    CountryName: countryInfo?.country?.names?.en,
    State:       subdiv != null && subdiv.length > 0 ? subdiv[subdiv.length-1].names?.en : "",
    TimeZoneOffset: GetTimeZoneOffset(countryInfo?.location?.time_zone)
  });
};
