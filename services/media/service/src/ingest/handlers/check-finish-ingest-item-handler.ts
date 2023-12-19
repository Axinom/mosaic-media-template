import { Logger } from '@axinom/mosaic-service-common';
import { TransactionalInboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CheckFinishIngestItemCommand,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { select, update } from 'zapatos/db';
import { Config } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';

export class CheckFinishIngestItemHandler extends MediaGuardedTransactionalInboxMessageHandler<
  CheckFinishIngestItemCommand,
  Config
> {
  constructor(config: Config) {
    super(
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      ['INGESTS_EDIT', 'ADMIN'],
      new Logger({
        config,
        context: CheckFinishIngestItemHandler.name,
      }),
      config,
    );
  }

  async handleMessage(
    {
      payload: { ingest_item_id, ingest_item_step_id, error_message },
    }: TransactionalInboxMessage<CheckFinishIngestItemCommand>,
    loginClient: ClientBase,
  ): Promise<void> {
    const updated = await update(
      'ingest_item_steps',
      {
        status: error_message ? 'ERROR' : 'SUCCESS',
        response_message: error_message,
      },
      { id: ingest_item_step_id, status: 'IN_PROGRESS' },
    ).run(loginClient);

    if (updated.length === 0) {
      this.logger.debug({
        message: 'Ingest item step is already processes. Skipping.',
        details: { step_id: ingest_item_step_id },
      });
      return;
    }

    const steps = await select(
      'ingest_item_steps',
      { ingest_item_id: ingest_item_id },
      { columns: ['status'] },
    ).run(loginClient);

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
      { id: ingest_item_id },
    ).run(loginClient);
  }
}
