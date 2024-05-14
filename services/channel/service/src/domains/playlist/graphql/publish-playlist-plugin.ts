import {
  buildAuthPgSettings,
  transactionWithContext,
} from '@axinom/mosaic-db-common';
import { getMappedError, Logger } from '@axinom/mosaic-service-common';
import { gql, makeExtendSchemaPlugin } from 'graphile-utils';
import { IsolationLevel } from 'zapatos/db';
import { getLongLivedToken, getPlaylistPgField } from '../../../common';
import { getValidatedExtendedContext } from '../../../graphql/models';
import { publishPlaylist } from '../publishing';

const logger = new Logger({
  context: 'publish-playlist-plugin',
});
/**
 * Plugin for playlist publication.
 */
export const PublishPlaylistPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      """
      The input details to publish playlist.
      """
      input PublishPlaylistInput {
        """
        Unique Identifier of the playlist to publish.
        """
        id: UUID!
        """
        A publish hash to ensure no changes have occurred since validation.
        """
        publishHash: String!
        """
        An arbitrary string value with no semantic meaning. Will be included in the
        payload verbatim. May be used to track mutations by the client.
        """
        clientMutationId: String
      }

      """
      The playlist published in defined format.
      """
      type PublishPlaylistPayload {
        """
        The published playlist.
        """
        playlist: Playlist! @pgField
        """
        The exact same \`clientMutationId\` that was provided in the mutation input,
        unchanged and unused. May be used by a client to track mutations.
        """
        clientMutationId: String
        query: Query
      }

      extend type Mutation {
        """
        Publish a playlist.
        """
        publishPlaylist(input: PublishPlaylistInput!): PublishPlaylistPayload!
      }
    `,
    resolvers: {
      Mutation: {
        publishPlaylist: async (
          _data: unknown,
          {
            input: { id, publishHash, clientMutationId },
          }: {
            input: {
              id: string;
              publishHash: string;
              clientMutationId?: string;
            };
          },
          context,
          { graphile },
        ) => {
          try {
            const { subject, storeOutboxMessage, jwtToken, config, ownerPool } =
              getValidatedExtendedContext(context);
            logger.debug(`Publishing playlist with ID '${id}'.`);

            const pgSettings = buildAuthPgSettings(subject, config.serviceId);
            const longLivedToken = await getLongLivedToken(jwtToken, config);

            await transactionWithContext(
              ownerPool,
              IsolationLevel.Serializable,
              pgSettings,
              async (ctx) => {
                await publishPlaylist(
                  id,
                  publishHash,
                  jwtToken,
                  longLivedToken,
                  storeOutboxMessage,
                  ctx,
                  config,
                );
              },
            );

            // return data
            const data = await getPlaylistPgField(id, build, graphile);
            logger.debug({
              message: `Playlist with ID '${id}' was successfully published.`,
            });
            return {
              data,
              query: build.$$isQuery,
              clientMutationId,
            };
          } catch (error) {
            throw getMappedError(error);
          }
        },
      },
    },
  };
});
