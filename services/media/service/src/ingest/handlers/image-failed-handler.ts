import {
  EnsureImageExistsFailedEvent,
  ImageServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CheckFinishIngestItemCommand,
  ImageMessageContext,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { Config } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import { getFutureIsoDateInMilliseconds } from '../utils';
import { checkIsIngestEvent } from '../utils/check-is-ingest-event';

export class ImageFailedHandler extends MediaGuardedTransactionalInboxMessageHandler<EnsureImageExistsFailedEvent> {
  constructor(
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
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
    loginClient: ClientBase,
  ): Promise<void> {
    if (!checkIsIngestEvent(metadata, this.logger, id, aggregateId)) {
      return;
    }
    const messageContext = metadata.messageContext as ImageMessageContext;

    await this.storeOutboxMessage<CheckFinishIngestItemCommand>(
      messageContext.ingestItemId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      {
        ingest_item_step_id: messageContext.ingestItemStepId,
        ingest_item_id: messageContext.ingestItemId,
        error_message: payload.message,
      },
      loginClient,
      {
        envelopeOverrides: { auth_token: metadata.authToken },
        lockedUntil: getFutureIsoDateInMilliseconds(1_000),
      },
    );
  }
}
