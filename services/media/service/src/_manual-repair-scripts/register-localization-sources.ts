/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  createOwnerPgPool,
  optional,
  OwnerPgPool,
} from '@axinom/mosaic-db-common';
import {
  RascalConfigBuilder,
  setupMessagingBroker,
} from '@axinom/mosaic-message-bus';
import {
  LocalizationServiceMultiTenantMessagingSettings,
  UpsertLocalizationSourceEntityCommand,
} from '@axinom/mosaic-messages';
import { Logger, ShutdownAction, sleep } from '@axinom/mosaic-service-common';
import { singularize } from 'inflection';
import { all, conditions, parent, select, selectOne } from 'zapatos/db';
import {
  collections,
  collections_images,
  episodes,
  episodes_images,
  movies,
  movies_images,
  movie_genres,
  tvshows,
  tvshows_images,
  tvshow_genres,
} from 'zapatos/schema';
import { getFullConfig } from '../common/config';
import { requestServiceAccountToken } from '../common/utils/token-utils';
import { LOCALIZATION_COLLECTION_TYPE } from '../domains/collections';
import { buildDisplayTitle } from '../domains/common';
import {
  LOCALIZATION_MOVIE_GENRE_TYPE,
  LOCALIZATION_MOVIE_TYPE,
} from '../domains/movies';
import {
  LOCALIZATION_EPISODE_TYPE,
  LOCALIZATION_SEASON_TYPE,
  LOCALIZATION_TVSHOW_GENRE_TYPE,
  LOCALIZATION_TVSHOW_TYPE,
} from '../domains/tvshows';

const logger = new Logger({
  context: 'register-localization-sources-script',
});

/**
 * This is a one-time migration script to sync localization sources for already
 * existing movies, movie genres, tvshows, tvshow genres, seasons, episodes, and
 * collections after the localization functionality is enabled.
 *
 * This script must be launched once after updated media service is launched. It
 * can be launched repeatedly if the need arises, e.g. if new localizable
 * properties are introduced.
 *
 * Entities are processed in batches of 1000, queried by ID, starting with the
 * oldest.
 *
 * Before sending out messages, this script will create corresponding localization
 * command queues and bindings (if they do not already exist).
 *
 * This script only sends out messages and does not modify any database rows in
 * the media service.
 *
 * Local script call:
 * yarn util:load-vars node dist/_manual-repair-scripts/register-localization-sources.js
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
  let typeIndex = 0;
  const typeMapping = [
    { type: 'MOVIE', counter: 0 },
    { type: 'TVSHOW', counter: 0 },
    { type: 'SEASON', counter: 0 },
    { type: 'EPISODE', counter: 0 },
    { type: 'COLLECTION', counter: 0 },
    { type: 'MOVIE_GENRE', counter: 0 },
    { type: 'TVSHOW_GENRE', counter: 0 },
  ];
  do {
    let payloads: UpsertLocalizationSourceEntityCommand[] = [];
    switch (typeMapping[typeIndex]?.type) {
      case 'MOVIE': {
        const { batch, lastEntityId } = await generateGenericPayloads(
          'movies',
          'movies_images',
          LOCALIZATION_MOVIE_TYPE,
          entityId,
          config.serviceId,
          ownerPool,
        );
        payloads = batch;
        entityId = lastEntityId;
        break;
      }
      case 'TVSHOW': {
        const { batch, lastEntityId } = await generateGenericPayloads(
          'tvshows',
          'tvshows_images',
          LOCALIZATION_TVSHOW_TYPE,
          entityId,
          config.serviceId,
          ownerPool,
        );
        payloads = batch;
        entityId = lastEntityId;
        break;
      }
      case 'SEASON': {
        const { batch, lastEntityId } = await generateSeasonPayloads(
          entityId,
          config.serviceId,
          ownerPool,
        );
        payloads = batch;
        entityId = lastEntityId;
        break;
      }
      case 'EPISODE': {
        const { batch, lastEntityId } = await generateEpisodePayloads(
          entityId,
          config.serviceId,
          ownerPool,
        );
        payloads = batch;
        entityId = lastEntityId;
        break;
      }
      case 'COLLECTION': {
        const { batch, lastEntityId } = await generateGenericPayloads(
          'collections',
          'collections_images',
          LOCALIZATION_COLLECTION_TYPE,
          entityId,
          config.serviceId,
          ownerPool,
        );
        payloads = batch;
        entityId = lastEntityId;
        break;
      }
      case 'MOVIE_GENRE': {
        payloads = await generateGenrePayloads(
          'movie_genres',
          LOCALIZATION_MOVIE_GENRE_TYPE,
          config.serviceId,
          ownerPool,
        );
        entityId = undefined;
        break;
      }
      case 'TVSHOW_GENRE': {
        payloads = await generateGenrePayloads(
          'tvshow_genres',
          LOCALIZATION_TVSHOW_GENRE_TYPE,
          config.serviceId,
          ownerPool,
        );
        entityId = undefined;
        break;
      }
      default: {
        continueMigration = false;
        break;
      }
    }

    if (typeIndex < typeMapping.length) {
      logger.log(
        `Processing ${payloads.length} message(s) of type ${typeMapping[typeIndex].type}. Already processed: ${typeMapping[typeIndex].counter}.`,
      );
      typeMapping[typeIndex].counter += payloads.length;
    }

    if (payloads.length < 1000 || entityId === undefined) {
      typeIndex++;
      entityId = undefined;
    }

    const settings =
      LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity;
    for await (const payload of payloads) {
      await broker.publish<UpsertLocalizationSourceEntityCommand>(
        payload.entity_id,
        settings,
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
  } while (continueMigration);

  for await (const shutdown of shutdownActions) {
    await shutdown();
  }

  logger.log({
    message: `Migration script finished. See details for summary of sent messages for each entity type.`,
    details: { summary: typeMapping },
  });
}

const generateGenericPayloads = async (
  tableName: movies.Table | tvshows.Table | episodes.Table | collections.Table,
  imagesTableName:
    | movies_images.Table
    | tvshows_images.Table
    | episodes_images.Table
    | collections_images.Table,
  entityType: string,
  entityId: number | undefined,
  serviceId: string,
  ownerPool: OwnerPgPool,
) => {
  const batch = await select(
    tableName,
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
          imagesTableName,
          {
            [`${singularize(tableName)}_id`]: parent('id'),
            image_type: 'COVER',
          },
          { columns: ['image_id'] },
        ),
      },
    },
  ).run(ownerPool);

  const payloads = batch.map<UpsertLocalizationSourceEntityCommand>(
    (entity) => ({
      service_id: serviceId,
      entity_type: entityType,
      entity_id: entity.id.toString(),
      entity_title: entity.title,
      image_id: entity.cover?.image_id,
      fields: {
        title: entity.title,
        description: entity.description,
        synopsis: entity.synopsis,
      },
    }),
  );

  return {
    batch: payloads,
    lastEntityId: batch.length > 0 ? batch[batch.length - 1].id : undefined,
  };
};

const generateSeasonPayloads = async (
  entityId: number | undefined,
  serviceId: string,
  ownerPool: OwnerPgPool,
) => {
  const batch = await select(
    'seasons',
    {
      ...optional(entityId ? conditions.gt(entityId) : undefined, (val) => ({
        id: val,
      })),
    },
    {
      limit: 1000,
      columns: ['id', 'description', 'synopsis', 'tvshow_id', 'index'],
      order: { by: 'id', direction: 'ASC' },
      lateral: {
        cover: selectOne(
          'seasons_images',
          { season_id: parent('id'), image_type: 'COVER' },
          { columns: ['image_id'] },
        ),
        tvshow: selectOne(
          'tvshows',
          { id: parent('tvshow_id') },
          { columns: ['title'] },
        ),
      },
    },
  ).run(ownerPool);

  const payloads = batch.map<UpsertLocalizationSourceEntityCommand>(
    (entity) => ({
      service_id: serviceId,
      entity_type: LOCALIZATION_SEASON_TYPE,
      entity_id: entity.id.toString(),
      entity_title: buildDisplayTitle('SEASON', entity, entity.tvshow),
      image_id: entity.cover?.image_id,
      fields: {
        description: entity.description,
        synopsis: entity.synopsis,
      },
    }),
  );

  return {
    batch: payloads,
    lastEntityId: batch.length > 0 ? batch[batch.length - 1].id : undefined,
  };
};

const generateEpisodePayloads = async (
  entityId: number | undefined,
  serviceId: string,
  ownerPool: OwnerPgPool,
) => {
  const batch = await select(
    'episodes',
    {
      ...optional(entityId ? conditions.gt(entityId) : undefined, (val) => ({
        id: val,
      })),
    },
    {
      limit: 1000,
      columns: ['id', 'title', 'description', 'synopsis', 'season_id', 'index'],
      order: { by: 'id', direction: 'ASC' },
      lateral: {
        cover: selectOne(
          'episodes_images',
          { episode_id: parent('id'), image_type: 'COVER' },
          { columns: ['image_id'] },
        ),
        season: selectOne(
          'seasons',
          { id: parent('season_id') },
          {
            columns: ['tvshow_id', 'index'],
            lateral: {
              tvshow: selectOne(
                'tvshows',
                { id: parent('tvshow_id') },
                { columns: ['title'] },
              ),
            },
          },
        ),
      },
    },
  ).run(ownerPool);

  const payloads = batch.map<UpsertLocalizationSourceEntityCommand>(
    (entity) => ({
      service_id: serviceId,
      entity_type: LOCALIZATION_EPISODE_TYPE,
      entity_id: entity.id.toString(),
      entity_title: buildDisplayTitle(
        'EPISODE',
        entity,
        entity.season,
        entity.season?.tvshow,
      ),
      image_id: entity.cover?.image_id,
      fields: {
        title: entity.title,
        description: entity.description,
        synopsis: entity.synopsis,
      },
    }),
  );

  return {
    batch: payloads,
    lastEntityId: batch.length > 0 ? batch[batch.length - 1].id : undefined,
  };
};

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
