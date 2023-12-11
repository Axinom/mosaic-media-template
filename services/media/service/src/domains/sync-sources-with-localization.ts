import {
  LogicalReplicationMessageHandler,
  OwnerPgPool,
  PgOutputScopedMessage,
} from '@axinom/mosaic-db-common';
import { Broker } from '@axinom/mosaic-message-bus';
import { MosaicError } from '@axinom/mosaic-service-common';
import { Config, InternalErrors, requestServiceAccountToken } from '../common';
import {
  collectionsImagesReplicationHandlers,
  collectionsReplicationHandlers,
} from './collections/localization';
import {
  LocalizationMessageData,
  ReplicationOperationHandlers,
} from './common';
import {
  movieGenresReplicationHandlers,
  moviesImagesReplicationHandlers,
  moviesReplicationHandlers,
} from './movies/localization';
import {
  episodesImagesReplicationHandlers,
  episodesReplicationHandlers,
  seasonsImagesReplicationHandlers,
  seasonsReplicationHandlers,
  tvshowGenresReplicationHandlers,
  tvshowsImagesReplicationHandlers,
  tvshowsReplicationHandlers,
} from './tvshows/localization';

const getTableSpecificHandlers = (
  scopedMessage: PgOutputScopedMessage,
  config: Config,
  ownerPool: OwnerPgPool,
): ReplicationOperationHandlers => {
  // If operation originated in context of Ingest - provide message context to
  // be able to receive response events, making sure source entity is created
  // in the localization service and ready to receive localizations.
  const messageContext = scopedMessage.new?.ingest_correlation_id
    ? { ingestItemId: scopedMessage.new.ingest_correlation_id }
    : undefined;

  switch (scopedMessage.tableName) {
    case 'movies':
      return moviesReplicationHandlers(config, messageContext);
    case 'movie_genres':
      return movieGenresReplicationHandlers(config);
    case 'movies_images':
      return moviesImagesReplicationHandlers(config, ownerPool);
    case 'tvshows':
      return tvshowsReplicationHandlers(config, messageContext);
    case 'tvshow_genres':
      return tvshowGenresReplicationHandlers(config);
    case 'tvshows_images':
      return tvshowsImagesReplicationHandlers(config, ownerPool);
    case 'seasons':
      return seasonsReplicationHandlers(config, ownerPool, messageContext);
    case 'seasons_images':
      return seasonsImagesReplicationHandlers(config, ownerPool);
    case 'episodes':
      return episodesReplicationHandlers(config, ownerPool, messageContext);
    case 'episodes_images':
      return episodesImagesReplicationHandlers(config, ownerPool);
    case 'collections':
      return collectionsReplicationHandlers(config);
    case 'collections_images':
      return collectionsImagesReplicationHandlers(config, ownerPool);
    default:
      throw new MosaicError({
        ...InternalErrors.UnsupportedReplicationTable,
        messageParams: [scopedMessage.tableName],
      });
  }
};

const getMessageData = async (
  scopedMessage: PgOutputScopedMessage,
  { insertHandler, updateHandler, deleteHandler }: ReplicationOperationHandlers,
): Promise<LocalizationMessageData | undefined> => {
  switch (scopedMessage.operation) {
    case 'insert':
      return insertHandler(scopedMessage.new);

    case 'update':
      return updateHandler(scopedMessage.new, scopedMessage.old);

    case 'delete':
      return deleteHandler(scopedMessage.old);

    default:
      throw new MosaicError({
        ...InternalErrors.UnsupportedReplicationOperation,
        messageParams: [scopedMessage.operation],
      });
  }
};

export const syncSourcesWithLocalization: (
  ownerPool: OwnerPgPool,
  broker: Broker,
  config: Config,
) => LogicalReplicationMessageHandler =
  (ownerPool: OwnerPgPool, broker: Broker, config: Config) =>
  async ({ scopedMessage }): Promise<void> => {
    const handlers = getTableSpecificHandlers(scopedMessage, config, ownerPool);
    const data = await getMessageData(scopedMessage, handlers);
    if (!data) {
      return;
    }

    const { settings, payload, messageContext } = data;
    const accessToken = await requestServiceAccountToken(config);

    await broker.publish(
      payload.entity_id,
      settings,
      payload,
      { auth_token: accessToken, message_context: messageContext },
      {
        routingKey: settings.getEnvironmentRoutingKey({
          tenantId: config.tenantId,
          environmentId: config.environmentId,
        }),
      },
    );
  };
