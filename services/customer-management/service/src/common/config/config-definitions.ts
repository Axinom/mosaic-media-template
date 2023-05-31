/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  getBasicConfigDefinitions,
  getBasicCustomizableConfigDefinitions,
  getBasicDbConfigDefinitions,
  getConfigType,
  getValidatedConfig,
} from '@axinom/mosaic-service-common';
import { from } from 'env-var';

/**
 * Get an object that contains all the configuration declaration functions to
 * load and validate the environment configurations.
 * @param variables `undefined` to use the process environment - or provide custom variables
 */
export const getConfigDefinitions = (
  variables: NodeJS.ProcessEnv = process.env,
) => {
  const env = from(variables);
  return {
    ...getBasicConfigDefinitions(variables),
    ...getBasicCustomizableConfigDefinitions(variables),

    /** @example PORT=8080 */
    port: () => env.get('PORT').default(10200).asPortNumber(),
    /** @example TENANT_ID=add3a8b8-c960-4f9e-86ca-4a64d132fbd8 */
    tenantId: () => env.get('TENANT_ID').required().asString(),
    /** @example ENVIRONMENT_ID=c3b69496-0296-4f0e-b128-ace32dce5e53 */
    environmentId: () => env.get('ENVIRONMENT_ID').required().asString(),
    /** @example ID_SERVICE_AUTH_BASE_URL=https://id.service.eu.axinom.net */
    idServiceAuthBaseUrl: () =>
      env.get('ID_SERVICE_AUTH_BASE_URL').required().asUrlString(),
    /**
     * get API token from env and use it to authenticate User service REST API
     */
    getUserServiceAPIKey: () => env.get('USER_SERVICE_REST_API_KEY').asString(),
    getUserServiceAPIURL: () => env.get('USER_SERVICE_REST_API_URL').asString(),
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
