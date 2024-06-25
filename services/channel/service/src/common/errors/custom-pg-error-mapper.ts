import {
  defaultPgErrorMapper,
  MosaicErrorInfo,
  MosaicErrorMapper,
  MosaicErrors,
} from '@axinom/mosaic-service-common';
import { GraphQLError } from 'graphql';

/**
 * Makes sure that original error is returned for custom channel service database validation errors.
 * Otherwise uses `defaultPgErrorMapper`
 */
export const customPgErrorMapper: MosaicErrorMapper<MosaicErrorInfo> = (
  error: Error,
  defaultError?: MosaicErrorInfo,
): MosaicErrorInfo | undefined => {
  const originalError = ((error as GraphQLError)?.originalError ??
    error) as Error & { code?: string; constraint?: string };

  // Custom Channel error
  if (originalError?.code === 'CCERR') {
    return {
      message: originalError?.message,
      code: MosaicErrors.DatabaseValidationFailed.code,
    };
  }

  return defaultPgErrorMapper(error, defaultError);
};
