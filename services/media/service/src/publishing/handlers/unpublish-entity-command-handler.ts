import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { Logger } from '@axinom/mosaic-service-common';
import {
  MediaServiceMessagingSettings,
  UnpublishEntityCommand,
} from 'media-messages';
import * as db from 'zapatos/db';
import { selectOne } from 'zapatos/db';
import { snapshots, Table } from 'zapatos/schema';
import { Config } from '../../common';
import { publishHandlerPermissions } from '../../domains/register-publishing';
import { MediaGuardedMessageHandler } from '../../messaging';
import { EntityPublishingProcessor } from '../models';
import {
  buildEntityTableName,
  getPublishedSnapshot,
  SnapshotWrapper,
} from '../utils';

export class UnpublishEntityCommandHandler extends MediaGuardedMessageHandler<UnpublishEntityCommand> {
  private readonly logger: Logger;

  constructor(
    protected readonly publishingProcessors: EntityPublishingProcessor[],
    protected readonly broker: Broker,
    private readonly loginPool: LoginPgPool,
    config: Config,
  ) {
    super(
      MediaServiceMessagingSettings.UnpublishEntity.messageType,
      publishHandlerPermissions,
      config,
    );

    this.logger = new Logger({
      config,
      context: UnpublishEntityCommandHandler.name,
    });
  }

  async onMessage(
    payload: UnpublishEntityCommand,
    messageInfo: MessageInfo<UnpublishEntityCommand>,
  ): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      db.IsolationLevel.Serializable,
      await this.getPgSettings(messageInfo),
      async (tnxClient) => {
        const payloadTable = payload.table_name as Table;
        let snapshot:
          | snapshots.Selectable
          | snapshots.JSONSelectable
          | undefined;
        if (payloadTable === 'snapshots') {
          snapshot = await selectOne('snapshots', {
            id: payload.entity_id,
          }).run(tnxClient);
        } else {
          snapshot = await getPublishedSnapshot(
            payloadTable,
            payload.entity_id,
            tnxClient,
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
          tnxClient,
          this.broker,
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
          messageInfo.envelope.auth_token,
        );
      },
    );
  }
}
