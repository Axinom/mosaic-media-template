import {
  LocalizationServiceMultiTenantMessagingSettings,
  LocalizeEntityFinishedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  StoreInboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CheckFinishIngestItemCommand,
  IngestMessageContext,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { Config } from '../../common';
import { MediaTransactionalInboxMessageHandler } from '../../messaging';
import { checkIsIngestEvent } from '../utils/check-is-ingest-event';

export class LocalizeEntityFinishedHandler extends MediaTransactionalInboxMessageHandler<LocalizeEntityFinishedEvent> {
  constructor(
    private readonly storeInboxMessage: StoreInboxMessage,
    config: Config,
  ) {
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

    await this.storeInboxMessage<CheckFinishIngestItemCommand>(
      messageContext.ingestItemId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      {
        ingest_item_step_id: messageContext.ingestItemStepId,
        ingest_item_id: messageContext.ingestItemId,
      },
      ownerClient,
      { metadata: { authToken: metadata.authToken } },
    );
  }
}
