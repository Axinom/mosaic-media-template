/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  getBasicConfigDefinitions,
  getBasicCustomizableConfigDefinitions,
  getBasicDbConfigDefinitions,
  getBasicGraphQlConfigDefinitions,
  getBasicMetricsEndpointDefinitions,
  getBasicRabbitMqConfigDefinitions,
  getConfigType,
  getValidatedConfig,
  pick,
} from '@axinom/mosaic-service-common';
import { from } from 'env-var';

export const getConfigDefinitions = (
  variables: NodeJS.ProcessEnv = process.env,
) => {
  const env = from(variables);
  const { tenantId, environmentId, idServiceAuthBaseUrl } = pick(
    getBasicCustomizableConfigDefinitions(variables),
    'tenantId',
    'environmentId',
    'idServiceAuthBaseUrl',
  );
  return {
    ...getBasicConfigDefinitions(variables),
    ...getBasicMetricsEndpointDefinitions(variables),
    ...getBasicGraphQlConfigDefinitions(10300, variables),
    ...getBasicDbConfigDefinitions(variables),
    ...getBasicRabbitMqConfigDefinitions(variables),
    tenantId,
    environmentId,
    idServiceAuthBaseUrl,
    geoIP2SASToken: () =>
      env.get('GEOIP2_BLOB_SAS_TOKEN').required().asString() ||
      'MISSING_GEOIP2_BLOB_SAS_TOKEN',
    geoIP2StorageAccount: () =>
      env.get('GEOIP2_BLOB_STORAGE_ACCOUNT').required().asString() ||
      'MISSING_GEOIP2_BLOB_STORAGE_ACCOUNT',
    geoIP2BlobContainer: () =>
      env.get('GEOIP2_BLOB_CONTAINER').required().asString() ||
      'MISSING_GEOIP2_BLOB_CONTAINER',
    geoIP2DatabaseFile: () =>
      env.get('GEOIP2_DATABASE_FILE').required().asString() ||
      'MISSING_GEOIP2_DATABASE_FILE',
    geoIP2UpdateSchedule: () =>
      env.get('GEOIP2_UPDATE_SCHEDULE').required().asString() || '0 0 * * *',
    serviceAccountClientId: () =>
      env.get('SERVICE_ACCOUNT_CLIENT_ID').required().asString(),
    /** @example SERVICE_ACCOUNT_CLIENT_SECRET=seXdE9XWCGv3tj3j56k38xlQ */
    serviceAccountClientSecret: () =>
      env.get('SERVICE_ACCOUNT_CLIENT_SECRET').required().asString(),
  };
};

/**
 * Get the full, validated configuration object.
 */
export const getFullConfig = (
  variables: NodeJS.ProcessEnv = process.env,
): Config => {
  return getValidatedConfig(getConfigDefinitions(variables));
};

const config = getConfigType(getConfigDefinitions());
/**
 * The full Configuration type
 */
export type Config = typeof config;

const dbConfig = getConfigType(getBasicDbConfigDefinitions());
/**
 * The Database related Configuration type
 */
export type DbConfig = typeof dbConfig;
