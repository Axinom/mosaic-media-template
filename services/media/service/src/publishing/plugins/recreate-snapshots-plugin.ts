import {
  buildPgSettings,
  transactionWithContext,
} from '@axinom/mosaic-db-common';
import { groupBy } from '@axinom/mosaic-service-common';
import { camelCase } from 'graphile-build';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
} from 'media-messages';
import { Client } from 'pg';
import pluralize from 'pluralize';
import { conditions as c, IsolationLevel, select } from 'zapatos/db';
import {
  buildBulkActionSettings,
  BulkMutationPluginFactory,
} from '../../graphql';
import {
  buildEntityTableName,
  bulkPublishingPayload,
  BulkPublishingResult,
  createListSnapshot,
  generateSnapshotJobId,
} from '../utils';

/**
 * Bulk operation plugin that takes snapshots metadata as an input and creates a new snapshot for each entity from which existing snapshots were created (based on entity_id and entity_type properties).
 * If multiple snapshots are selected which were created from the same entity, only one new snapshot will be created.
 * Newly creates snapshots are not published.
 */
export const RecreateSnapshotsPlugin = BulkMutationPluginFactory(
  ['snapshots'],
  buildBulkActionSettings({
    mutationNameBuilder: (filter) =>
      camelCase(`recreate-${pluralize(filter.entityTypeName)}`),
    outType: bulkPublishingPayload,
    resolverBodyBuilder: async (
      ids,
      _filter,
      context,
      _input,
      token,
    ): Promise<BulkPublishingResult> => {
      const snapshots = await select(
        'snapshots',
        { id: c.isIn(ids as number[]) },
        {
          columns: [
            'entity_id',
            'entity_type',
            'entity_title',
            'is_list_snapshot',
          ],
        },
      ).run(context.pgClient as Client);

      const entities = Object.values(
        groupBy(snapshots, ['entity_id', 'entity_type']),
      ).map((group) => ({
        id: group[0].entity_id,
        table: buildEntityTableName(group[0].entity_type),
        title:
          group[0].entity_title ??
          `${group[0].entity_type} snapshot ${group[0].entity_id}`, //TODO Change to a common title generation function when working on seasons
        type: group[0].entity_type,
        isListSnapshot: group[0].is_list_snapshot,
      }));

      const jobId = generateSnapshotJobId();
      const pgSettings = buildPgSettings(
        context.subject,
        context.config.dbGqlRole,
        context.config.serviceId,
      );
      for (const entity of entities) {
        let tableName = entity.table;
        let entityId = entity.id;

        if (entity.isListSnapshot) {
          const snapshot = await transactionWithContext(
            context.ownerPool,
            IsolationLevel.Serializable,
            pgSettings,
            async (ctx) => {
              return createListSnapshot(entity, generateSnapshotJobId(), ctx);
            },
          );
          tableName = 'snapshots';
          entityId = snapshot.id;
        }

        await context.messagingBroker.publish<PublishEntityCommand>(
          MediaServiceMessagingSettings.PublishEntity.messageType,
          {
            table_name: tableName,
            entity_id: entityId,
            job_id: jobId,
            publish_options: {
              action: 'NO_PUBLISH',
            },
          },
          { auth_token: token },
        );
      }

      return {
        publishingJobId: jobId,
        affectedIds: ids,
        totalCount: ids.length,
      };
    },
  }),
);
