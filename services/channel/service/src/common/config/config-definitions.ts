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
    ...getBasicMetricsEndpointDefinitions(variables),
    ...getBasicGraphQlConfigDefinitions(12000, variables),
    ...getBasicDbConfigDefinitions(variables),
    ...getBasicRabbitMqConfigDefinitions(variables),
    ...getBasicCustomizableConfigDefinitions(variables),

    videoServiceBaseUrl: () =>
      env.get('VIDEO_SERVICE_BASE_URL').required().asUrlString(),

    imageServiceBaseUrl: () =>
      env.get('IMAGE_SERVICE_BASE_URL').required().asUrlString(),

    playlistShouldBe24Hours: () =>
      env.get('PLAYLIST_SHOULD_BE_24_HOURS').default('FALSE').asBoolStrict(),

    isLocalizationEnabled: () =>
      env.get('IS_LOCALIZATION_ENABLED').default('TRUE').asBoolStrict(),

    localizationServiceBaseUrl: function () {
      return env
        .get('LOCALIZATION_SERVICE_BASE_URL')
        .required(this.isLocalizationEnabled())
        .asUrlString();
    },

    /**
     * Optional Service Account Client ID, used to get ID service token during development
     */
    devServiceAccountClientId: () =>
      env.get('DEV_SERVICE_ACCOUNT_CLIENT_ID').asString(),

    /**
     * Optional Service Account Client Secret, used to get ID service token during development
     */
    devServiceAccountClientSecret: () =>
      env.get('DEV_SERVICE_ACCOUNT_CLIENT_SECRET').asString(),
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
