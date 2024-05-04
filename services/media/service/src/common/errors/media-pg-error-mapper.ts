import {
  defaultPgErrorMapper,
  MosaicErrorInfo,
  MosaicErrorMapper,
  mosaicErrorMappingFactory,
  MosaicErrors,
  PgErrorCode as MosaicPgErrorCode,
} from '@axinom/mosaic-service-common';
import { GraphQLError } from 'graphql';
import { PgErrorCode } from './pg-error-code';

export const mediaPgErrorMapper: MosaicErrorMapper<MosaicErrorInfo> = (
  error: Error,
  defaultError?: MosaicErrorInfo,
): MosaicErrorInfo | undefined => {
  const originalError = ((error as GraphQLError)?.originalError ??
    error) as Error & { code?: string; constraint?: string };

  if (
    originalError?.code === PgErrorCode.ActiveSnapshots ||
    originalError?.code === PgErrorCode.InvalidDateTimeFormat
  ) {
    return {
      message: originalError.message,
      code: MosaicErrors.DatabaseValidationFailed.code,
    };
  }

  if (
    originalError?.code === MosaicPgErrorCode.UniqueConstraintError &&
    originalError?.constraint?.endsWith('_external_id_key')
  ) {
    return {
      message: `The External ID value is unique and already in use. Please choose another value.`,
      code: MosaicErrors.DatabaseValidationFailed.code,
    };
  }

  return defaultPgErrorMapper(error, defaultError);
};

export const getMediaMappedError =
  mosaicErrorMappingFactory(mediaPgErrorMapper);
