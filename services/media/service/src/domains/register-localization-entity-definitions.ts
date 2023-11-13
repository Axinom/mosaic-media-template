import { Broker } from '@axinom/mosaic-message-bus';
import { LocalizationServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import { Config, requestServiceAccountToken } from '../common';
import { getCollectionLocalizationEntityDefinitions } from './collections';
import { getMovieLocalizationEntityDefinitions } from './movies';
import { getTvshowLocalizationEntityDefinitions } from './tvshows';

export const registerLocalizationEntityDefinitions = async (
  broker: Broker,
  config: Config,
): Promise<void> => {
  const accessToken = await requestServiceAccountToken(config);
  const settings =
    LocalizationServiceMultiTenantMessagingSettings.DeclareEntityDefinition;
  const movieDefinitions = getMovieLocalizationEntityDefinitions(
    config.serviceId,
  );
  const tvshowDefinitions = getTvshowLocalizationEntityDefinitions(
    config.serviceId,
  );
  const collectionDefinitions = getCollectionLocalizationEntityDefinitions(
    config.serviceId,
  );
  const definitions = [
    ...movieDefinitions,
    ...tvshowDefinitions,
    ...collectionDefinitions,
  ];
  for (const definition of definitions) {
    await broker.publish(
      config.environmentId,
      settings,
      definition,
      { auth_token: accessToken },
      {
        routingKey: settings.getEnvironmentRoutingKey({
          tenantId: config.tenantId,
          environmentId: config.environmentId,
        }),
      },
    );
  }
};
