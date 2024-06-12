import {
  buildAuthPgSettings,
  transactionWithContext,
} from '@axinom/mosaic-db-common';
import { getMappedError, Logger } from '@axinom/mosaic-service-common';
import { gql, makeExtendSchemaPlugin } from 'graphile-utils';
import { IsolationLevel } from 'zapatos/db';
import { getLongLivedToken, getPlaylistPgField } from '../../../common';
import { getValidatedExtendedContext } from '../../../graphql/models';
import { unpublishPlaylist } from '../publishing';

const logger = new Logger({
  context: 'unpublish-playlist-plugin',
});
/**
 * Plugin for  triggering playlist unpublish action.
 */
export const UnpublishPlaylistPlugin = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      """
      The input details to unpublish playlist.
      """
      input UnpublishPlaylistInput {
        """
        Unique Identifier of the playlist to unpublish.
        """
        id: UUID!
        """
        An arbitrary string value with no semantic meaning. Will be included in the
        payload verbatim. May be used to track mutations by the client.
        """
        clientMutationId: String
      }
      type UnpublishPlaylistPayload {
        """
        The unpublished playlist.
        """
        playlist: Playlist @pgField
        """
        The exact same \`clientMutationId\` that was provided in the mutation input,
        unchanged and unused. May be used by a client to track mutations.
        """
        clientMutationId: String
        query: Query
      }
      extend type Mutation {
        """
        Unpublish a playlist. The playlist must be published.
        """
        unpublishPlaylist(
          input: UnpublishPlaylistInput!
        ): UnpublishPlaylistPayload
      }
    `,
    resolvers: {
      Mutation: {
        unpublishPlaylist: async (_query, { input }, context, { graphile }) => {
          const { build } = graphile;
          const { id } = input;

          try {
            const { subject, storeOutboxMessage, jwtToken, config, ownerPool } =
              getValidatedExtendedContext(context);
            logger.debug(`Unpublishing playlist with ID '${id}'.`);

            const pgSettings = buildAuthPgSettings(subject, config.serviceId);
            const token = await getLongLivedToken(jwtToken, config);

            await transactionWithContext(
              ownerPool,
              IsolationLevel.Serializable,
              pgSettings,
              async (txn) => {
                await unpublishPlaylist(id, token, storeOutboxMessage, txn);
              },
            );

            // return data
            const data = await getPlaylistPgField(id, build, graphile);
            logger.debug({
              message: `Playlist with ID '${id}' was successfully unpublished.`,
            });
            return {
              data,
              query: build.$$isQuery,
              clientMutationId: input?.clientMutationId,
            };
          } catch (error) {
            throw getMappedError(error);
          }
        },
      },
    },
  };
});
