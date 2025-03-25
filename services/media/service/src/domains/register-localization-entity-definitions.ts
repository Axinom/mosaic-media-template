import {
  DeclareEntityDefinitionCommand,
  LocalizationServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { Config, requestServiceAccountToken } from '../common';
import { getCollectionLocalizationEntityDefinitions } from './collections';
import { getMovieLocalizationEntityDefinitions } from './movies';
import { getReviewLocalizationEntityDefinitions } from './reviews/localization/get-review-localization-entity-definitions';
import { getTvshowLocalizationEntityDefinitions } from './tvshows';

export const registerLocalizationEntityDefinitions = async (
  storeOutboxMessage: StoreOutboxMessage,
  loginClient: ClientBase,
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
  const reviewDefinitions = getReviewLocalizationEntityDefinitions(
    config.serviceId,
  );
  const definitions = [
    ...movieDefinitions,
    ...tvshowDefinitions,
    ...collectionDefinitions,
    ...reviewDefinitions,
  ];
  for (const definition of definitions) {
    await storeOutboxMessage<DeclareEntityDefinitionCommand>(
      config.environmentId,
      settings,
      definition,
      loginClient,
      {
        envelopeOverrides: {
          auth_token: accessToken,
        },
        options: {
          routingKey: settings.getEnvironmentRoutingKey({
            tenantId: config.tenantId,
            environmentId: config.environmentId,
          }),
        },
      },
    );
  }
};
