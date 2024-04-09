import {
  EnsureVideoExistsFailedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CheckFinishIngestItemCommand,
  MediaServiceMessagingSettings,
  VideoMessageContext,
} from 'media-messages';
import { ClientBase } from 'pg';
import { Config } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import { checkIsIngestEvent } from '../utils/check-is-ingest-event';

export class VideoFailedHandler extends MediaGuardedTransactionalInboxMessageHandler<EnsureVideoExistsFailedEvent> {
  constructor(
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsFailed,
      ['INGESTS_EDIT', 'ADMIN'],
      new Logger({
        config,
        context: VideoFailedHandler.name,
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
    }: TypedTransactionalMessage<EnsureVideoExistsFailedEvent>,
    ownerClient: ClientBase,
  ): Promise<void> {
    if (!checkIsIngestEvent(metadata, this.logger, id, aggregateId)) {
      return;
    }

    const messageContext = metadata.messageContext as VideoMessageContext;

    await this.storeOutboxMessage<CheckFinishIngestItemCommand>(
      messageContext.ingestItemId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      {
        ingest_item_step_id: messageContext.ingestItemStepId,
        ingest_item_id: messageContext.ingestItemId,
        error_message: payload.message,
      },
      ownerClient,
      { envelopeOverrides: { auth_token: metadata.authToken } },
    );
  }
}
