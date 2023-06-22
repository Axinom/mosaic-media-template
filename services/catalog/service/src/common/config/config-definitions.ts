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

export const getConfigDefinitions = (
  variables: NodeJS.ProcessEnv = process.env,
) => {
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
