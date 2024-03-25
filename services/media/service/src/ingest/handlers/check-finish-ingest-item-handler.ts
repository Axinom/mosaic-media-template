import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CheckFinishIngestItemCommand,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { select, update } from 'zapatos/db';
import { Config } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';

export class CheckFinishIngestItemHandler extends MediaGuardedTransactionalInboxMessageHandler<CheckFinishIngestItemCommand> {
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
    }: TypedTransactionalMessage<CheckFinishIngestItemCommand>,
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
      { columns: ['status', 'id'] },
    ).run(loginClient);

    const inProgressSteps = steps.filter((r) => r.status === 'IN_PROGRESS');
    if (inProgressSteps.length > 0) {
      this.logger.debug({
        message: 'Ingest item steps still in progress - rechecking.',
        details: {
          step_id: ingest_item_step_id,
          in_progress_steps: inProgressSteps,
        },
      });
      return;
    }

    await update(
      'ingest_items',
      {
        status: steps.some((r) => r.status === 'ERROR') ? 'ERROR' : 'SUCCESS',
      },
      { id: ingest_item_id },
    ).run(loginClient);
  }
}
