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
import pluralize from 'pluralize';
import { conditions as c, IsolationLevel, select } from 'zapatos/db';
import {
  buildBulkActionSettings,
  BulkMutationPluginFactory,
  getValidatedExtendedContext,
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
      const { subject, config, ownerPool, storeInboxMessage } =
        getValidatedExtendedContext(context);
      const pgSettings = buildPgSettings(
        subject,
        config.dbGqlRole,
        config.serviceId,
      );
      const jobId = await transactionWithContext(
        ownerPool,
        IsolationLevel.Serializable,
        pgSettings,
        async (ctx) => {
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
          ).run(ctx);

          const entities = Object.values(
            groupBy(snapshots, ['entity_id', 'entity_type']),
          ).map((group) => ({
            id: group[0].entity_id,
            table: buildEntityTableName(group[0].entity_type),
            title:
              group[0].entity_title ??
              `${group[0].entity_type} snapshot ${group[0].entity_id}`, // TODO Change to a common title generation function when working on seasons
            type: group[0].entity_type,
            isListSnapshot: group[0].is_list_snapshot,
          }));

          const jobId = generateSnapshotJobId();
          for (const entity of entities) {
            let tableName = entity.table;
            let entityOrSnapshotId = entity.id;

            if (entity.isListSnapshot) {
              const snapshot = await createListSnapshot(
                entity,
                generateSnapshotJobId(),
                ctx,
              );
              tableName = 'snapshots';
              entityOrSnapshotId = snapshot.id;
            }

            await storeInboxMessage<PublishEntityCommand>(
              entityOrSnapshotId.toString(),
              MediaServiceMessagingSettings.PublishEntity,
              {
                table_name: tableName,
                entity_id: entityOrSnapshotId,
                job_id: jobId,
                publish_options: { action: 'NO_PUBLISH' },
              },
              ctx,
              { metadata: { authToken: token } },
            );
          }
          return jobId;
        },
      );

      return {
        publishingJobId: jobId,
        affectedIds: ids,
        totalCount: ids.length,
      };
    },
  }),
);
