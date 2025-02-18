import { isNullOrWhitespace, MosaicError } from '@axinom/mosaic-service-common';
import { Client } from 'pg';
import { makeWrapResolversPlugin } from 'postgraphile';
import { conditions as c, param, select, selectOne, sql } from 'zapatos/db';
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

      if (
        !isNullOrWhitespace(args.input.patch.externalId) &&
        !isNullOrWhitespace(media.external_id)
      ) {
        throw new MosaicError({
          ...CommonErrors.CannotUpdateExternalId,
          messageParams: [mediaType, mediaId],
        });
      }

      const referencePublishStatus = await getReferencePublishStatus(
        mediaType,
        mediaId,
        pgClient,
      );
      if (
        (media.publish_status !== 'NOT_PUBLISHED' &&
          !isNullOrWhitespace(args.input.patch.externalId)) ||
        referencePublishStatus
      ) {
        throw new MosaicError({
          ...CommonErrors.CannotUpdateExternalIdForPublishedMedia,
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

      return resolve();
    },
  };
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
