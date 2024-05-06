import { GuardedContext } from '@axinom/mosaic-id-guard';
import { Logger } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { singularize } from 'graphile-build';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
} from 'media-messages';
import { ClientBase } from 'pg';
import { EntityTypeEnum } from 'zapatos/custom';
import { Queryable, selectExactlyOne, update } from 'zapatos/db';
import { snapshots, Table } from 'zapatos/schema';
import { Config } from '../../common';
import { publishHandlerPermissions } from '../../domains/publishing-definition';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging/transactional-outbox-inbox/media-guard-transactional-message-handler';
import { EntityPublishingProcessor } from '../models';
import {
  buildEntityTableName,
  createSnapshotWithRelation,
  generateSnapshotJobId,
  SnapshotWrapper,
} from '../utils';

export class PublishEntityHandler extends MediaGuardedTransactionalInboxMessageHandler<PublishEntityCommand> {
  constructor(
    protected readonly publishingProcessors: EntityPublishingProcessor[],
    protected readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      MediaServiceMessagingSettings.PublishEntity,
      publishHandlerPermissions,
      new Logger({
        config,
        context: PublishEntityHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload, metadata }: TypedTransactionalMessage<PublishEntityCommand>,
    ownerClient: ClientBase,
  ): Promise<void> {
    const payloadTable = payload.table_name as Table;
    let snapshot: snapshots.JSONSelectable;
    if (payloadTable === 'snapshots') {
      snapshot = await selectExactlyOne('snapshots', {
        id: payload.entity_id,
      }).run(ownerClient);
    } else {
      snapshot = await createSnapshotWithRelation(
        singularize(payloadTable).toUpperCase() as EntityTypeEnum,
        payload.entity_id,
        payload.job_id ?? generateSnapshotJobId(),
        ownerClient,
      );
    }

    const wrapper = new SnapshotWrapper(
      snapshot.id,
      ownerClient,
      this.storeOutboxMessage,
      this.config,
    );
    const publishType = buildEntityTableName(snapshot.entity_type);
    const processor = this.publishingProcessors.find(
      (p) => p.type === publishType,
    );
    if (processor === undefined) {
      this.logger.error({
        message: `Entity type '${publishType}' is not recognized. Please make sure that a correct publish entity processor is registered for specified type.`,
        details: { payload },
      });
      await this.setErrorState(snapshot.id, ownerClient);
      return;
    }

    await wrapper.prepareAndValidate(
      processor,
      this.config,
      metadata.authToken,
    );

    // Snapshot is always implicitly created if entity publication is triggered.
    switch (payload.publish_options.action) {
      case 'PUBLISH_NOW':
        await wrapper.publish(
          processor.publishMessagingSettings,
          metadata.authToken,
        );
        return;
      case 'SCHEDULE':
        // TODO: Implement scheduling
        return;

      default:
        break;
    }
  }
  override async handleErrorMessage(
    _error: Error,
    { payload }: TypedTransactionalMessage<PublishEntityCommand>,
    ownerClient: ClientBase,
    retry: boolean,
    _context?: GuardedContext | undefined,
  ): Promise<void> {
    if (retry) {
      return;
    }
    let snapshotId = payload.entity_id;
    if ((payload.table_name as Table) !== 'snapshots') {
      snapshotId = (
        await createSnapshotWithRelation(
          singularize(payload.table_name).toUpperCase() as EntityTypeEnum,
          payload.entity_id,
          payload.job_id ?? generateSnapshotJobId(),
          ownerClient,
        )
      ).id;
    }
    await this.setErrorState(snapshotId, ownerClient);
  }

  private async setErrorState(
    snapshotId: number,
    queryable: Queryable,
  ): Promise<void> {
    // TODO: Notifications logic expected in the future
    await update(
      'snapshots',
      { snapshot_state: 'ERROR' },
      { id: snapshotId },
    ).run(queryable);
  }
}
