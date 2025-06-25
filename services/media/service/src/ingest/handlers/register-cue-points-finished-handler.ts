import {
  RegisterCuePointsFinishedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { IngestMessageContext } from 'media-messages';
import { ClientBase } from 'pg';
import { update } from 'zapatos/db';
import { Config } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import { checkIsIngestEvent } from '../utils/check-is-ingest-event';

export class RegisterCuePointsFinishedHandler extends MediaGuardedTransactionalInboxMessageHandler<RegisterCuePointsFinishedEvent> {
  constructor(config: Config) {
    super(
      VideoServiceMultiTenantMessagingSettings.RegisterCuePointsFinished,
      ['INGEST_EDITOR', 'ADMIN'],
      new Logger({
        config,
        context: RegisterCuePointsFinishedHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    {
      metadata,
      id,
      aggregateId,
    }: TypedTransactionalMessage<RegisterCuePointsFinishedEvent>,
    ownerClient: ClientBase,
  ): Promise<void> {
    if (!checkIsIngestEvent(metadata, this.logger, id, aggregateId)) {
      return;
    }

    const messageContext = metadata.messageContext as IngestMessageContext;

    await update(
      'ingest_item_steps',
      {
        status: 'SUCCESS',
      },
      { id: messageContext.ingestItemStepId },
    ).run(ownerClient);
  }
}
