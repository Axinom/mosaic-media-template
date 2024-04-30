import {
  EnsureImageExistsFailedEvent,
  ImageServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ImageMessageContext } from 'media-messages';
import { ClientBase } from 'pg';
import { update } from 'zapatos/db';
import { Config } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import { checkIsIngestEvent } from '../utils/check-is-ingest-event';

export class ImageFailedHandler extends MediaGuardedTransactionalInboxMessageHandler<EnsureImageExistsFailedEvent> {
  constructor(config: Config) {
    super(
      ImageServiceMultiTenantMessagingSettings.EnsureImageExistsFailed,
      ['INGESTS_EDIT', 'ADMIN'],
      new Logger({
        config,
        context: ImageFailedHandler.name,
      }),
      config,
    );
  }

  async handleMessage(
    {
      id,
      aggregateId,
      payload,
      metadata,
    }: TypedTransactionalMessage<EnsureImageExistsFailedEvent>,
    ownerClient: ClientBase,
  ): Promise<void> {
    if (!checkIsIngestEvent(metadata, this.logger, id, aggregateId)) {
      return;
    }
    const messageContext = metadata.messageContext as ImageMessageContext;
    await update(
      'ingest_item_steps',
      {
        status: 'ERROR',
        response_message: payload.message,
      },
      { id: messageContext.ingestItemStepId },
    ).run(ownerClient);
  }
}
