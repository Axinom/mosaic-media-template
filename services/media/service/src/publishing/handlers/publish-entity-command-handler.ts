import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { Logger } from '@axinom/mosaic-service-common';
import { singularize } from 'graphile-build';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
} from 'media-messages';
import { EntityTypeEnum } from 'zapatos/custom';
import {
  IsolationLevel,
  Queryable,
  selectExactlyOne,
  update,
} from 'zapatos/db';
import { snapshots, Table } from 'zapatos/schema';
import { Config } from '../../common';
import { publishHandlerPermissions } from '../../domains/register-publishing';
import { MediaGuardedMessageHandler } from '../../messaging';
import { EntityPublishingProcessor } from '../models';
import {
  buildEntityTableName,
  createSnapshotWithRelation,
  generateSnapshotJobId,
  SnapshotWrapper,
} from '../utils';

export class PublishEntityCommandHandler extends MediaGuardedMessageHandler<PublishEntityCommand> {
  private readonly logger;

  constructor(
    protected readonly publishingProcessors: EntityPublishingProcessor[],
    protected readonly broker: Broker,
    private readonly loginPool: LoginPgPool,
    config: Config,
  ) {
    super(
      MediaServiceMessagingSettings.PublishEntity.messageType,
      publishHandlerPermissions,
      config,
    );

    this.logger = new Logger({
      config,
      context: PublishEntityCommandHandler.name,
    });
  }

  public async onMessage(
    payload: PublishEntityCommand,
    messageInfo: MessageInfo<PublishEntityCommand>,
  ): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.RepeatableRead,
      await this.getPgSettings(messageInfo),
      async (tnxClient) => {
        const payloadTable = payload.table_name as Table;
        let snapshot: snapshots.JSONSelectable;
        if (payloadTable === 'snapshots') {
          snapshot = await selectExactlyOne('snapshots', {
            id: payload.entity_id,
          }).run(tnxClient);
        } else {
          snapshot = await createSnapshotWithRelation(
            singularize(payloadTable).toUpperCase() as EntityTypeEnum,
            payload.entity_id,
            payload.job_id ?? generateSnapshotJobId(),
            tnxClient,
          );
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
            details: { payload },
          });
          await this.setErrorState(snapshot.id, tnxClient);
          return;
        }

        await wrapper.prepareAndValidate(
          processor,
          this.config,
          messageInfo.envelope.auth_token,
        );

        // Snapshot is always implicitly created if entity publication is triggered.
        switch (payload.publish_options.action) {
          case 'PUBLISH_NOW':
            await wrapper.publish(
              processor.publishMessagingSettings,
              messageInfo.envelope.auth_token,
            );
            return;
          case 'SCHEDULE':
            // TODO: Implement scheduling
            return;

          default:
            break;
        }
      },
    );
  }

  public async onMessageFailure(
    payload: PublishEntityCommand,
    messageInfo: MessageInfo,
  ): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      await this.getPgSettings(messageInfo),
      async (tnxClient) => {
        let snapshotId = payload.entity_id;
        if ((payload.table_name as Table) !== 'snapshots') {
          snapshotId = (
            await createSnapshotWithRelation(
              singularize(payload.table_name).toUpperCase() as EntityTypeEnum,
              payload.entity_id,
              payload.job_id ?? generateSnapshotJobId(),
              tnxClient,
            )
          ).id;
        }
        await this.setErrorState(snapshotId, tnxClient);
      },
    );
  }

  private async setErrorState(
    snapshotId: number,
    queryable: Queryable,
  ): Promise<void> {
    //TODO: Notifications logic expected in the future
    await update(
      'snapshots',
      { snapshot_state: 'ERROR' },
      { id: snapshotId },
    ).run(queryable);
  }
}
