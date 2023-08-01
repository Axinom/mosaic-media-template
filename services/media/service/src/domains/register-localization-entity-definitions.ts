import { Broker } from '@axinom/mosaic-message-bus';
import { LocalizationServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import { Config, requestServiceAccountToken } from '../common';
import { getMovieLocalizationEntityDefinitions } from './movies';

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
  const definitions = [...movieDefinitions];
  for (const definition of definitions) {
    await broker.publish(
      settings.messageType,
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
