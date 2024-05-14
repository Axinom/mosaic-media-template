import {
  buildAuthPgSettings,
  transactionWithContext,
} from '@axinom/mosaic-db-common';
import { getMappedError, Logger } from '@axinom/mosaic-service-common';
import { gql, makeExtendSchemaPlugin } from 'graphile-utils';
import { IsolationLevel } from 'zapatos/db';
import { publishChannel } from '../..';
import { getChannelPgField, getLongLivedToken } from '../../../common';
import { getValidatedExtendedContext } from '../../../graphql/models';

const logger = new Logger({
  context: 'publish-channel-plugin',
});
/**
 * Plugin for channel publication.
 */
export const PublishChannelPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      """
      The input details to publish the channel.
      """
      input PublishChannelInput {
        """
        Unique Identifier of the channel to publish.
        """
        id: UUID!
        """
        A publish hash to ensure no changes have occurred since the publish validation.
        """
        publishHash: String!
        """
        An arbitrary string value with no semantic meaning. Will be included in the
        payload verbatim. May be used to track mutations by the client.
        """
        clientMutationId: String
      }

      """
      The published channel.
      """
      type PublishChannelPayload {
        """
        The published channel.
        """
        channel: Channel! @pgField
        """
        The exact same \`clientMutationId\` that was provided in the mutation input,
        unchanged and unused. May be used by a client to track mutations.
        """
        clientMutationId: String
        query: Query
      }

      extend type Mutation {
        """
        Publish a channel.
        """
        publishChannel(input: PublishChannelInput!): PublishChannelPayload!
      }
    `,
    resolvers: {
      Mutation: {
        publishChannel: async (
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
            logger.debug(`Publishing channel with ID '${id}'.`);

            const pgSettings = buildAuthPgSettings(subject, config.serviceId);
            const longLivedToken = await getLongLivedToken(jwtToken, config);

            await transactionWithContext(
              ownerPool,
              IsolationLevel.Serializable,
              pgSettings,
              async (ctx) => {
                await publishChannel(
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
            const data = await getChannelPgField(id, build, graphile);
            logger.debug({
              message: `Channel with ID '${id}' was successfully published.`,
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
