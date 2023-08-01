/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createOwnerPgPool, optional } from '@axinom/mosaic-db-common';
import {
  RascalConfigBuilder,
  setupMessagingBroker,
} from '@axinom/mosaic-message-bus';
import {
  LocalizationServiceMultiTenantMessagingSettings,
  UpsertLocalizationSourceEntityCommand,
} from '@axinom/mosaic-messages';
import { Logger, ShutdownAction, sleep } from '@axinom/mosaic-service-common';
import { all, conditions, parent, select, selectOne } from 'zapatos/db';
import { getFullConfig } from './common/config';
import { requestServiceAccountToken } from './common/utils/token-utils';
import {
  LOCALIZATION_MOVIE_GENRE_TYPE,
  LOCALIZATION_MOVIE_TYPE,
} from './domains/movies';

const logger = new Logger({
  context: 'one-time-register-movie-localization-sources',
});

/**
 * This is a one-time migration script to sync localization sources for already
 * existing movies and movie genres after the localization functionality is enabled.
 *
 * This script must be launched once after updated media service is launched. It
 * can be launched repeatedly if the need arises, e.g. if new localizable
 * properties are introduced.
 *
 * Movies are processed in batches of 1000, queries by ID, starting with the
 * oldest. The last batch would also contain all movie genres.
 *
 * Before sending out messages, this script will create corresponding localization
 * command queues and bindings (if they do not already exist).
 *
 * This script only sends out messages and does not modify any database rows in
 * the media service.
 */
async function main(): Promise<void> {
  logger.log('Starting the migration script...');
  const config = getFullConfig();
  const shutdownActions: ShutdownAction[] = [];

  logger.log('Creating messaging and DB components...');
  const builders = [
    new RascalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
      config,
    ).sendCommand(),
  ];

  const broker = await setupMessagingBroker({
    config,
    builders,
    logger,
    shutdownActions,
  });

  const ownerPool = createOwnerPgPool(
    config.dbOwnerConnectionString,
    logger,
    shutdownActions,
  );

  const accessToken = await requestServiceAccountToken(config);

  logger.log('Sending out messages...');

  let continueMigration = true;
  let entityId: number | undefined;
  let counter = 0;
  do {
    const moviesBatch = await select(
      'movies',
      {
        ...optional(entityId ? conditions.gt(entityId) : undefined, (val) => ({
          id: val,
        })),
      },
      {
        limit: 1000,
        columns: ['id', 'title', 'description', 'synopsis'],
        order: { by: 'id', direction: 'ASC' },
        lateral: {
          cover: selectOne(
            'movies_images',
            { movie_id: parent('id'), image_type: 'COVER' },
            { columns: ['image_id'] },
          ),
        },
      },
    ).run(ownerPool);

    const payloads = moviesBatch.map<UpsertLocalizationSourceEntityCommand>(
      (movie) => ({
        service_id: config.serviceId,
        entity_type: LOCALIZATION_MOVIE_TYPE,
        entity_id: movie.id.toString(),
        entity_title: movie.title,
        image_id: movie.cover?.image_id,
        fields: {
          title: movie.title,
          description: movie.description,
          synopsis: movie.synopsis,
        },
      }),
    );

    if (moviesBatch.length < 1000) {
      // Insert movie genres together with the last batch
      const genrePayloads = (
        await select('movie_genres', all, {
          columns: ['id', 'title'],
        }).run(ownerPool)
      ).map<UpsertLocalizationSourceEntityCommand>(({ id, title }) => ({
        service_id: config.serviceId,
        entity_type: LOCALIZATION_MOVIE_GENRE_TYPE,
        entity_id: id.toString(),
        entity_title: title,
        fields: { title },
      }));
      payloads.push(...genrePayloads);
      continueMigration = false;
    }

    if (moviesBatch.length > 0) {
      // Set last entity ID as a cursor for the next batch
      entityId = moviesBatch[moviesBatch.length - 1].id;
    }

    const settings =
      LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity;
    for await (const payload of payloads) {
      await broker.publish(
        settings.messageType,
        payload,
        { auth_token: accessToken },
        {
          routingKey: settings.getEnvironmentRoutingKey({
            tenantId: config.tenantId,
            environmentId: config.environmentId,
          }),
        },
      );
      // Waiting a little for each message to be sent to make sure that all are
      // sent before the shutdown actions are initiated, since it might take a
      // bit of time for broker to actually send out the message.
      await sleep(100);
    }
    counter += payloads.length;
  } while (continueMigration);

  for await (const shutdown of shutdownActions) {
    await shutdown();
  }

  logger.log(
    `Migration script finished. ${counter} messages sent for movies and movie genres.`,
  );
}

main().catch((error) => {
  logger.error(error);
  process.exit(-1);
});
