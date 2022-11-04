import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageInfo } from '@axinom/mosaic-message-bus';
import { Logger } from '@axinom/mosaic-service-common';
import {
  CheckFinishIngestItemCommand,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { SubscriptionConfig } from 'rascal';
import { IsolationLevel, select, update } from 'zapatos/db';
import { Config } from '../../common';
import { MediaGuardedMessageHandler } from '../../messaging';

export class CheckFinishIngestItemHandler extends MediaGuardedMessageHandler<CheckFinishIngestItemCommand> {
  private logger: Logger = new Logger({
    context: CheckFinishIngestItemHandler.name,
  });
  constructor(
    private loginPool: LoginPgPool,
    config: Config,
    overrides?: SubscriptionConfig,
  ) {
    super(
      MediaServiceMessagingSettings.CheckFinishIngestItem.messageType,
      ['INGESTS_EDIT', 'ADMIN'],
      config,
      overrides,
    );
  }

  async onMessage(
    content: CheckFinishIngestItemCommand,
    message: MessageInfo,
  ): Promise<void> {
    const pgSettings = await this.getPgSettings(message);
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      pgSettings,
      async (ctx) => {
        const updated = await update(
          'ingest_item_steps',
          {
            status: content.error_message ? 'ERROR' : 'SUCCESS',
            response_message: content.error_message,
          },
          { id: content.ingest_item_step_id, status: 'IN_PROGRESS' },
        ).run(ctx);

        if (updated.length === 0) {
          this.logger.debug({
            message: 'Ingest item step is already processes. Skipping.',
            details: { step_id: content.ingest_item_step_id },
          });
          return;
        }

        const steps = await select(
          'ingest_item_steps',
          { ingest_item_id: content.ingest_item_id },
          { columns: ['status'] },
        ).run(ctx);

        const stepStates = steps.map((x) => x.status);
        if (stepStates.some((state) => state === 'IN_PROGRESS')) {
          return;
        }

        await update(
          'ingest_items',
          {
            status: stepStates.some((state) => state === 'ERROR')
              ? 'ERROR'
              : 'SUCCESS',
          },
          { id: content.ingest_item_id },
        ).run(ctx);
      },
    );
  }
}
