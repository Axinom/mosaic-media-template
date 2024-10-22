import { Logger } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  MediaServiceMessagingSettings,
  UnpublishEntityCommand,
} from 'media-messages';
import { ClientBase } from 'pg';
import { selectOne } from 'zapatos/db';
import { snapshots, Table } from 'zapatos/schema';
import { Config } from '../../common';
import { publishHandlerPermissions } from '../../domains/publishing-definition';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import { EntityPublishingProcessor } from '../models';
import {
  buildEntityTableName,
  getPublishedSnapshot,
  SnapshotWrapper,
} from '../utils';

export class UnpublishEntityHandler extends MediaGuardedTransactionalInboxMessageHandler<UnpublishEntityCommand> {
  constructor(
    private readonly publishingProcessors: EntityPublishingProcessor[],
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      MediaServiceMessagingSettings.UnpublishEntity,
      publishHandlerPermissions,
      new Logger({
        config,
        context: UnpublishEntityHandler.name,
      }),
      config,
    );
  }

  async handleMessage(
    { payload, metadata }: TypedTransactionalMessage<UnpublishEntityCommand>,
    ownerClient: ClientBase,
  ): Promise<void> {
    const payloadTable = payload.table_name as Table;
    let snapshot: snapshots.Selectable | snapshots.JSONSelectable | undefined;
    if (payloadTable === 'snapshots') {
      snapshot = await selectOne('snapshots', {
        id: payload.entity_id,
      }).run(ownerClient);
    } else {
      snapshot = await getPublishedSnapshot(
        payloadTable,
        payload.entity_id,
        ownerClient,
      );
    }

    if (snapshot === undefined) {
      this.logger.debug({
        message: 'Published snapshot not found, unpublish skipped.',
        details: { payload },
      });
      return;
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
        details: { tableName: payload.table_name },
      });
      return;
    }
    await wrapper.unpublish(
      processor.unpublishMessagingSettings,
      metadata.authToken,
    );
  }
}
