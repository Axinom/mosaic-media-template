import {
  defaultWriteLogMapper,
  Logger,
  LogMessage,
  WriteLogMapper,
} from '@axinom/mosaic-service-common';
import { CommonErrors } from './common-errors';

export const entitlementLogMapper: WriteLogMapper = (
  log: LogMessage,
  error: Error,
  logger: Logger = new Logger(),
): void => {
  switch (log?.details?.code) {
    // Logging the following logs as "error", because adjustments in the code are most probably required
    case CommonErrors.CatalogErrors.code:
    case CommonErrors.BillingErrors.code:
    case CommonErrors.NoMainVideo.code:
    case CommonErrors.LicenseNotFound.code:
    case CommonErrors.BillingConnectionFailed.code:
    case CommonErrors.CatalogConnectionFailed.code:
    case CommonErrors.MultipleMainVideos.code:
    case CommonErrors.UnableToPlaybackVideo.code:
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
