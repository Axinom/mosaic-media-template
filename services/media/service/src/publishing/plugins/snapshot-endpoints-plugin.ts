import { MosaicError } from '@axinom/mosaic-service-common';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
  UnpublishEntityCommand,
} from 'media-messages';
import { gql as gqlExtended, makeExtendSchemaPlugin } from 'postgraphile';
import { CommonErrors, getLongLivedToken } from '../../common';
import { getValidatedExtendedContext } from '../../graphql';
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
          const { storeInboxMessage, jwtToken, config, pgClient } =
            getValidatedExtendedContext(context);

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

          await storeInboxMessage<PublishEntityCommand>(
            snapshotId.toString(),
            MediaServiceMessagingSettings.PublishEntity,
            {
              entity_id: snapshotId,
              table_name: 'snapshots',
              publish_options: {
                action: 'PUBLISH_NOW',
              },
            },
            pgClient,
            {
              metadata: {
                authToken: await getLongLivedToken(jwtToken, config),
              },
            },
          );

          return snapshot;
        },

        unpublishSnapshot: async (_query, args, context, { graphile }) => {
          const snapshotId: number = args['snapshotId'];
          const { storeInboxMessage, jwtToken, config, pgClient } =
            getValidatedExtendedContext(context);

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

          await storeInboxMessage<UnpublishEntityCommand>(
            snapshotId.toString(),
            MediaServiceMessagingSettings.UnpublishEntity,
            {
              entity_id: snapshotId,
              table_name: 'snapshots',
            },
            pgClient,
            {
              metadata: {
                authToken: await getLongLivedToken(jwtToken, config),
              },
            },
          );

          return snapshot;
        },
      },
    },
  };
});
