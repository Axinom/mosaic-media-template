/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createOwnerPgPool, OwnerPgPool } from '@axinom/mosaic-db-common';
import {
  LocalizationServiceMultiTenantMessagingSettings,
  UpsertLocalizationSourceEntityCommand,
} from '@axinom/mosaic-messages';
import { Logger, ShutdownAction } from '@axinom/mosaic-service-common';
import { setupOutboxStorage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  getOutboxPollingListenerSettings,
  PollingListenerConfig,
} from 'pg-transactional-outbox';
import { all, select } from 'zapatos/db';
import { movie_genres, tvshow_genres } from 'zapatos/schema';
import { getFullConfig } from '../common/config';
import { requestServiceAccountToken } from '../common/utils/token-utils';
import { LOCALIZATION_MOVIE_GENRE_TYPE } from '../domains/movies';
import { LOCALIZATION_TVSHOW_GENRE_TYPE } from '../domains/tvshows';

const logger = new Logger({
  context: 'register-localization-genres-script',
});

/**
 * This is a migration script to sync localization sources for
 * movie genres and tvshow genres after the localization functionality is enabled.
 *
 * Local script call:
 * yarn util:load-vars node dist/_manual-repair-scripts/register-localization-genres.js
 */
async function main(): Promise<void> {
  logger.log('Starting the genres migration script...');
  const config = getFullConfig();
  const shutdownActions: ShutdownAction[] = [];

  logger.log('Creating messaging and DB components...');

  const outboxConfig: PollingListenerConfig = {
    outboxOrInbox: 'outbox',
    dbListenerConfig: {
      connectionString: config.dbOwnerConnectionString,
    },
    settings: getOutboxPollingListenerSettings(),
  };
  const storeOutboxMessage = setupOutboxStorage(outboxConfig, logger, config);

  const ownerPool = createOwnerPgPool(
    config.dbOwnerConnectionString,
    logger,
    shutdownActions,
  );

  const accessToken = await requestServiceAccountToken(config);

  logger.log('Processing genres...');

  const typeMapping = [
    { type: 'MOVIE_GENRE', counter: 0 },
    { type: 'TVSHOW_GENRE', counter: 0 },
  ];

  for (const type of typeMapping) {
    let payloads: UpsertLocalizationSourceEntityCommand[] = [];

    if (type.type === 'MOVIE_GENRE') {
      payloads = await generateGenrePayloads(
        'movie_genres',
        LOCALIZATION_MOVIE_GENRE_TYPE,
        config.serviceId,
        ownerPool,
      );
    } else {
      payloads = await generateGenrePayloads(
        'tvshow_genres',
        LOCALIZATION_TVSHOW_GENRE_TYPE,
        config.serviceId,
        ownerPool,
      );
    }

    logger.log(`Processing ${payloads.length} message(s) of type ${type.type}`);
    type.counter = payloads.length;

    const settings =
      LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity;
    for await (const payload of payloads) {
      await storeOutboxMessage<UpsertLocalizationSourceEntityCommand>(
        payload.entity_id,
        settings,
        payload,
        ownerPool,
        {
          envelopeOverrides: { auth_token: accessToken },
          options: {
            routingKey: settings.getEnvironmentRoutingKey({
              tenantId: config.tenantId,
              environmentId: config.environmentId,
            }),
          },
        },
      );
    }
  }

  for await (const shutdown of shutdownActions) {
    await shutdown();
  }

  logger.log({
    message: `Genres migration script finished. The service will send out the stored messages when its running.`,
    details: { summary: typeMapping },
  });
}

const generateGenrePayloads = async (
  genreTable: movie_genres.Table | tvshow_genres.Table,
  entityType: string,
  serviceId: string,
  ownerPool: OwnerPgPool,
) => {
  return (
    await select(genreTable, all, {
      columns: ['id', 'title'],
    }).run(ownerPool)
  ).map<UpsertLocalizationSourceEntityCommand>(({ id, title }) => ({
    service_id: serviceId,
    entity_type: entityType,
    entity_id: id.toString(),
    entity_title: title,
    fields: { title },
  }));
};

main().catch((error) => {
  logger.error(error);
  process.exit(-1);
});
