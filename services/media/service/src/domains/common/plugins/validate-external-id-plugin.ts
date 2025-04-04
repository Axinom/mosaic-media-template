import { isNullOrWhitespace, MosaicError } from '@axinom/mosaic-service-common';
import { Client } from 'pg';
import { makeWrapResolversPlugin } from 'postgraphile';
import {
  conditions as c,
  param,
  select,
  selectOne,
  sql,
  update,
} from 'zapatos/db';
import { collections, collection_relations, Table } from 'zapatos/schema';
import { CommonErrors } from '../../../common';
import { Mutations } from '../../../generated/graphql/operations';
import { ExtendedGraphQLContext } from '../../../graphql';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const validateExternalIdUpdate = (
  mediaType: 'Movie' | 'Tv Show' | 'Season' | 'Episode' | 'Collection',
) => {
  return {
    resolve: async (
      resolve: any,
      _source: any,
      args: { [argName: string]: any },
      context: ExtendedGraphQLContext,
    ) => {
      const { pgClient } = context;
      if (pgClient === undefined) {
        throw new MosaicError({
          message: 'pgClient is undefined',
        });
      }
      const mediaId = args.input.id;
      let table = getTable(mediaType);

      const media = await selectOne(table, {
        id: mediaId,
      }).run(pgClient);

      if (media === undefined) {
        throw new MosaicError({
          ...CommonErrors.MediaNotFound,
          messageParams: [mediaType, mediaId],
        });
      }

      // We do not allow updating the external ID if the media is published and has no external ID.
      if (
        !isNullOrWhitespace(args.input.patch.externalId) &&
        isNullOrWhitespace(media.external_id) &&
        media.publish_status !== 'NOT_PUBLISHED'
      ) {
        throw new MosaicError({
          ...CommonErrors.CannotUpdateExternalId,
          messageParams: [mediaType, mediaId],
        });
      }

      // If the media is not published, but a connected collection is published, we should not allow updating the external ID.
      const referencePublishStatus = await getReferencePublishStatus(
        mediaType,
        mediaId,
        pgClient,
      );
      if (
        !isNullOrWhitespace(args.input.patch.externalId) &&
        referencePublishStatus
      ) {
        throw new MosaicError({
          ...CommonErrors.CannotUpdateExternalIdForPublishedMedia,
          messageParams: [mediaType, mediaId],
        });
      }

      // In cases where the external ID is empty, we should not allow updating the title as well since the title is used to build the publishing ID.
      if (
        isNullOrWhitespace(media.external_id) &&
        !isNullOrWhitespace(args.input.patch.title) &&
        referencePublishStatus
      ) {
        throw new MosaicError({
          ...CommonErrors.CannotUpdateTitleForPublishedMedia,
          messageParams: [mediaType, mediaId],
        });
      }

      // When a media is published without the external-id, the title is used to build the publishing id.
      // So we should disallow updating the title as well in a case where the external_id is empty and the media is published.
      if (
        !isNullOrWhitespace(args.input.patch.title) &&
        isNullOrWhitespace(media.external_id) &&
        media.publish_status !== 'NOT_PUBLISHED'
      ) {
        throw new MosaicError({
          ...CommonErrors.CannotUpdateTitleForPublishedMedia,
          messageParams: [mediaType, mediaId],
        });
      }

      // We update the republish status of all snapshots that are referencing this media if the external ID or the title is update while the external ID is empty.
      // This is to ensure that the snapshots are republished with the correct publishing ID.
      if (
        (isNullOrWhitespace(media.external_id) &&
          !isNullOrWhitespace(args.input.patch.title)) ||
        !isNullOrWhitespace(args.input.patch.externalId)
      ) {
        await updateExistingSnapshotRepublishStatus(
          mediaType,
          mediaId,
          pgClient,
        );
      }

      return resolve();
    },
  };
};

const updateExistingSnapshotRepublishStatus = async (
  mediaType: 'Movie' | 'Tv Show' | 'Season' | 'Episode' | 'Collection',
  id: number,
  pgClient: Client,
): Promise<void> => {
  const table = getTable(mediaType);
  const media = await selectOne(table, {
    id,
  }).run(pgClient);

  if (media === undefined) {
    throw new MosaicError({
      ...CommonErrors.MediaNotFound,
      messageParams: [mediaType, id],
    });
  }

  await update(
    'snapshots',
    {
      is_republish_allowed: false,
    },
    {
      entity_id: id,
      entity_type: getEntityTable(mediaType),
    },
  ).run(pgClient);
};

const getTable = (
  mediaType: 'Movie' | 'Tv Show' | 'Season' | 'Episode' | 'Collection',
): Extract<
  Table,
  'movies' | 'tvshows' | 'seasons' | 'episodes' | 'collections'
> => {
  switch (mediaType) {
    case 'Movie':
      return 'movies';
    case 'Tv Show':
      return 'tvshows';
    case 'Season':
      return 'seasons';
    case 'Episode':
      return 'episodes';
    case 'Collection':
      return 'collections';
    default:
      throw new MosaicError({
        message: `Unknown media type: ${mediaType}`,
      });
  }
};

const getEntityTable = (
  mediaType: 'Movie' | 'Tv Show' | 'Season' | 'Episode' | 'Collection',
): 'MOVIE' | 'TVSHOW' | 'SEASON' | 'EPISODE' | 'COLLECTION' => {
  switch (mediaType) {
    case 'Movie':
      return 'MOVIE';
    case 'Tv Show':
      return 'TVSHOW';
    case 'Season':
      return 'SEASON';
    case 'Episode':
      return 'EPISODE';
    case 'Collection':
      return 'COLLECTION';
    default:
      throw new MosaicError({
        message: `Unknown media type: ${mediaType}`,
      });
  }
};

// Check if any of the referenced entities are published.
// If so we should not allow updating the external ID.
const getReferencePublishStatus = async (
  mediaType: 'Movie' | 'Tv Show' | 'Season' | 'Episode' | 'Collection',
  mediaId: string,
  pgClient: Client,
): Promise<boolean> => {
  switch (mediaType) {
    case 'Movie':
      const movieCollections = await sql<
        collections.SQL | collection_relations.SQL,
        collections.JSONSelectable[]
      >`SELECT c.*
        FROM app_public.collections c
        INNER JOIN app_public.collection_relations cr 
        ON c.id = cr.collection_id 
        WHERE cr.movie_id = ${param(mediaId)}
        AND c.publish_status IN ('PUBLISHED','CHANGED')`.run(pgClient);

      return movieCollections.length > 0;
    case 'Tv Show':
      const tvShowCollections = await sql<
        collections.SQL | collection_relations.SQL,
        collections.JSONSelectable[]
      >`SELECT c.*
        FROM app_public.collections c
        INNER JOIN app_public.collection_relations cr 
        ON c.id = cr.collection_id 
        WHERE cr.tvshow_id = ${param(mediaId)}
        AND c.publish_status IN ('PUBLISHED','CHANGED')`.run(pgClient);

      const seasonReferences = await select('seasons', {
        tvshow_id: Number(mediaId),
        publish_status: c.isIn(['PUBLISHED', 'CHANGED']),
      }).run(pgClient);

      return tvShowCollections.length > 0 || seasonReferences.length > 0;
    case 'Season':
      const seasonCollections = await sql<
        collections.SQL | collection_relations.SQL,
        collections.JSONSelectable[]
      >`SELECT c.*
        FROM app_public.collections c
        INNER JOIN app_public.collection_relations cr 
        ON c.id = cr.collection_id 
        WHERE cr.season_id = ${param(mediaId)}
        AND c.publish_status IN ('PUBLISHED','CHANGED')`.run(pgClient);

      const episodeReferences = await select('episodes', {
        season_id: Number(mediaId),
        publish_status: c.isIn(['PUBLISHED', 'CHANGED']),
      }).run(pgClient);

      return seasonCollections.length > 0 || episodeReferences.length > 0;
    case 'Episode':
      const episodeCollections = await sql<
        collections.SQL | collection_relations.SQL,
        collections.JSONSelectable[]
      >`SELECT c.*
        FROM app_public.collections c
        INNER JOIN app_public.collection_relations cr 
        ON c.id = cr.collection_id 
        WHERE cr.episode_id = ${param(mediaId)}
        AND c.publish_status IN ('PUBLISHED','CHANGED')`.run(pgClient);

      return episodeCollections.length > 0;
    case 'Collection':
      const childCollections = await sql<
        collections.SQL | collection_relations.SQL,
        collections.JSONSelectable[]
      >`SELECT c.*
        FROM app_public.collections c
        INNER JOIN app_public.collection_relations cr 
        ON c.id = cr.collection_id 
        WHERE cr.child_collection_id = ${param(mediaId)}
        AND c.publish_status IN ('PUBLISHED','CHANGED')`.run(pgClient);

      return childCollections.length > 0;
    default:
      throw new MosaicError({
        message: `Unknown media type: ${mediaType}`,
      });
  }
};

/**
 * This plugin validates if the media is in unpublished state before updating the external ID.
 */
export const ValidateExternalIdUpdatePlugin = makeWrapResolversPlugin({
  Mutation: {
    [Mutations.updateMovie]: validateExternalIdUpdate('Movie'),
    [Mutations.updateTvshow]: validateExternalIdUpdate('Tv Show'),
    [Mutations.updateSeason]: validateExternalIdUpdate('Season'),
    [Mutations.updateEpisode]: validateExternalIdUpdate('Episode'),
    [Mutations.updateCollection]: validateExternalIdUpdate('Collection'),
  },
});
