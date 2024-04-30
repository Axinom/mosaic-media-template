import {
  LocalizationServiceMultiTenantMessagingSettings,
  LocalizeEntityFinishedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { IngestMessageContext } from 'media-messages';
import { ClientBase } from 'pg';
import { update } from 'zapatos/db';
import { Config } from '../../common';
import { MediaTransactionalInboxMessageHandler } from '../../messaging';
import { checkIsIngestEvent } from '../utils/check-is-ingest-event';

export class LocalizeEntityFinishedHandler extends MediaTransactionalInboxMessageHandler<LocalizeEntityFinishedEvent> {
  constructor(config: Config) {
    super(
      LocalizationServiceMultiTenantMessagingSettings.LocalizeEntityFinished,
      new Logger({
        config,
        context: LocalizeEntityFinishedHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    {
      payload,
      metadata,
      id,
      aggregateId,
    }: TypedTransactionalMessage<LocalizeEntityFinishedEvent>,
    ownerClient: ClientBase,
  ): Promise<void> {
    if (
      !checkIsIngestEvent(metadata, this.logger, id, aggregateId) ||
      payload.service_id !== this.config.serviceId
    ) {
      // skipping events for entity types from different services and non-ingest events
      return;
    }

    const messageContext = metadata.messageContext as IngestMessageContext;

    await update(
      'ingest_item_steps',
      { status: 'SUCCESS' },
      { id: messageContext.ingestItemStepId },
    ).run(ownerClient);
  }
}
