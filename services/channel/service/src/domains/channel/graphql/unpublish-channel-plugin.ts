import {
  buildAuthPgSettings,
  transactionWithContext,
} from '@axinom/mosaic-db-common';
import { getMappedError, Logger } from '@axinom/mosaic-service-common';
import { gql, makeExtendSchemaPlugin } from 'graphile-utils';
import { IsolationLevel } from 'zapatos/db';
import { getChannelPgField, getLongLivedToken } from '../../../common';
import { getValidatedExtendedContext } from '../../../graphql/models';
import { unpublishChannel } from '../publishing';

const logger = new Logger({
  context: 'unpublish-channel-plugin',
});

/**
 * Plugin for unpublishing a channel
 */
export const UnpublishChannelPlugin = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      """
      The input details to unpublish the channel.
      """
      input UnpublishChannelInput {
        """
        Unique Identifier of the channel to unpublish.
        """
        id: UUID!
        """
        An arbitrary string value with no semantic meaning. Will be included in the
        payload verbatim. May be used to track mutations by the client.
        """
        clientMutationId: String
      }
      type UnpublishChannelPayload {
        """
        The unpublished channel.
        """
        channel: Channel @pgField
        """
        The exact same \`clientMutationId\` that was provided in the mutation input,
        unchanged and unused. May be used by a client to track mutations.
        """
        clientMutationId: String
        query: Query
      }
      extend type Mutation {
        """
        Unpublish a channel. The channel must be published.
        """
        unpublishChannel(input: UnpublishChannelInput!): UnpublishChannelPayload
      }
    `,
    resolvers: {
      Mutation: {
        unpublishChannel: async (_query, { input }, context, { graphile }) => {
          const { build } = graphile;
          const { id } = input;
          try {
            const { subject, storeOutboxMessage, jwtToken, config, ownerPool } =
              getValidatedExtendedContext(context);
            logger.debug(`Unpublishing channel with ID '${id}'.`);

            const pgSettings = buildAuthPgSettings(subject, config.serviceId);
            const token = await getLongLivedToken(jwtToken, config);

            await transactionWithContext(
              ownerPool,
              IsolationLevel.Serializable,
              pgSettings,
              async (ctx) => {
                await unpublishChannel(id, token, storeOutboxMessage, ctx);
              },
            );

            // return data
            const data = await getChannelPgField(id, build, graphile);
            logger.debug({
              message: `Channel with ID '${id}' was successfully unpublished.`,
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
