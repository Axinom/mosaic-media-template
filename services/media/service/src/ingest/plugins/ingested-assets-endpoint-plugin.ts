/* eslint-disable @typescript-eslint/no-explicit-any */
import { MosaicError } from '@axinom/mosaic-service-common';
import { gql, makeExtendSchemaPlugin } from 'postgraphile';
import { ExtendedGraphQLContext } from 'src/graphql';
import { parent, select, selectOne } from 'zapatos/db';

/**
 * Plugin that adds a custom graphql endpoint `ingestedAssets` which returns the id, externalId and publishingId properties given the ingestDocumentId.
 */
export const IngestedAssetsPlugin = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      input IngestedAssetsInput {
        ingestDocumentId: Int!
      }

      type IngestedAssetPayload {
        assetType: String!
        id: Int!
        externalId: String!
        publishingId: String
        ingestStatus: String!
      }

      type IngestedAssetsPayload {
        nodes: [IngestedAssetPayload!]!
      }

      extend type Query {
        ingestedAssets(input: IngestedAssetsInput!): IngestedAssetsPayload
      }
    `,
    resolvers: {
      Query: {
        ingestedAssets: async (
          _query,
          args,
          context: ExtendedGraphQLContext,
          _resolveInfo,
        ) => {
          const { pgClient } = context;
          if (pgClient === undefined) {
            throw new MosaicError({
              code: 'PG_CLIENT_NOT_FOUND',
              message: 'PG Client not found.',
            });
          }

          const ingestedAssets = await select(
            'ingest_items',
            { ingest_document_id: args.input.ingestDocumentId },
            {
              columns: ['external_id', 'entity_id', 'status'],
              order: { by: 'id', direction: 'ASC' },
              lateral: {
                movie: selectOne(
                  'movies',
                  { id: parent('entity_id') },
                  { columns: ['id', 'publishing_id'] },
                ),
                tvshow: selectOne(
                  'tvshows',
                  { id: parent('entity_id') },
                  { columns: ['id', 'publishing_id'] },
                ),
                season: selectOne(
                  'seasons',
                  { id: parent('entity_id') },
                  { columns: ['id', 'publishing_id'] },
                ),
                episode: selectOne(
                  'episodes',
                  { id: parent('entity_id') },
                  { columns: ['id', 'publishing_id'] },
                ),
                collection: selectOne(
                  'collections',
                  { id: parent('entity_id') },
                  { columns: ['id', 'publishing_id'] },
                ),
              },
            },
          ).run(pgClient);

          const nodes = ingestedAssets.map((a) => {
            let assetType: string;
            let publishingId: string | null = null;

            if (a.movie) {
              assetType = 'Movie';
              publishingId = a.movie.publishing_id;
            } else if (a.tvshow) {
              assetType = 'TVShow';
              publishingId = a.tvshow.publishing_id;
            } else if (a.season) {
              assetType = 'Season';
              publishingId = a.season.publishing_id;
            } else if (a.episode) {
              assetType = 'Episode';
              publishingId = a.episode.publishing_id;
            } else if (a.collection) {
              assetType = 'Collection';
              publishingId = a.collection.publishing_id;
            } else {
              assetType = 'Unknown';
            }

            return {
              assetType,
              id: a.entity_id,
              externalId: a.external_id,
              publishingId,
              ingestStatus: a.status,
            };
          });

          return { nodes };
        },
      },
    },
  };
});
