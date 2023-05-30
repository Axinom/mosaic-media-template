import {
  defaultWriteLogMapper,
  Logger,
  LogMessage,
  WriteLogMapper,
} from '@axinom/mosaic-service-common';
import { CommonErrors } from './common-errors';

/**
 * Extends default error to log mapping.
 * Logs License errors as INFO.
 */
export const catalogLogMapper: WriteLogMapper = (
  log: LogMessage,
  error: Error,
  logger: Logger = new Logger(),
): void => {
  switch (log?.details?.code) {
    case CommonErrors.LicenseNotFound.code:
      logger.error(error, log);
      break;

    case CommonErrors.LicenseIsNotValid.code:
      logger.debug(error, log);
      break;

    default:
      defaultWriteLogMapper(log, error, logger);
      break;
  }
};
