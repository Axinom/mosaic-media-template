import { MosaicError } from '@axinom/mosaic-service-common';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
  UnpublishEntityCommand,
} from 'media-messages';
import { gql as gqlExtended, makeExtendSchemaPlugin } from 'postgraphile';
import { CommonErrors, getLongLivedToken } from '../../common';
import { ExtendedGraphQLContext } from '../../graphql';
import { getSnapshotPgField } from '../utils';

/**
 * Plugin that adds `publishSnapshot` and `unpublishSnapshot` endpoints.
 */
export const SnapshotEndpointsPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gqlExtended`
      extend type Mutation {
        publishSnapshot(snapshotId: Int!): Snapshot
        unpublishSnapshot(snapshotId: Int!): Snapshot
      }
    `,
    resolvers: {
      Mutation: {
        publishSnapshot: async (_query, args, context, { graphile }) => {
          const snapshotId: number = args['snapshotId'];
          const { messagingBroker } = context as ExtendedGraphQLContext;

          const snapshot = await getSnapshotPgField(
            snapshotId,
            build,
            graphile,
          );

          if (!snapshot) {
            throw new MosaicError({
              ...CommonErrors.SnapshotNotFound,
              messageParams: [snapshotId],
            });
          }

          await messagingBroker.publish<PublishEntityCommand>(
            MediaServiceMessagingSettings.PublishEntity.messageType,
            {
              entity_id: snapshotId,
              table_name: 'snapshots',
              publish_options: {
                action: 'PUBLISH_NOW',
              },
            },
            {
              auth_token: await getLongLivedToken(
                context.jwtToken ?? '',
                context.config,
              ),
            },
          );

          return snapshot;
        },

        unpublishSnapshot: async (_query, args, context, { graphile }) => {
          const snapshotId: number = args['snapshotId'];
          const { messagingBroker } = context as ExtendedGraphQLContext;

          const snapshot = await getSnapshotPgField(
            snapshotId,
            build,
            graphile,
          );

          if (!snapshot) {
            throw new MosaicError({
              ...CommonErrors.SnapshotNotFound,
              messageParams: [snapshotId],
            });
          }

          await messagingBroker.publish<UnpublishEntityCommand>(
            MediaServiceMessagingSettings.UnpublishEntity.messageType,
            {
              entity_id: snapshotId,
              table_name: 'snapshots',
            },
            {
              auth_token: await getLongLivedToken(
                context.jwtToken ?? '',
                context.config,
              ),
            },
          );

          return snapshot;
        },
      },
    },
  };
});
