import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import {
  EnsureVideoExistsAlreadyExistedEvent,
  EnsureVideoExistsCreationStartedEvent,
} from '@axinom/mosaic-messages';
import { Logger, MosaicError } from '@axinom/mosaic-service-common';
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
import { selectExactlyOne, update } from 'zapatos/db';
import { CommonErrors, Config } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import { IngestEntityProcessor } from '../models';
import { getFutureIsoDateInMilliseconds } from '../utils';
import { checkIsIngestEvent } from '../utils/check-is-ingest-event';
import { getIngestErrorMessage } from '../utils/ingest-validation';

export abstract class VideoSucceededHandler<
  TContent extends
    | EnsureVideoExistsAlreadyExistedEvent
    | EnsureVideoExistsCreationStartedEvent,
> extends MediaGuardedTransactionalInboxMessageHandler<TContent> {
  constructor(
    private entityProcessors: IngestEntityProcessor[],
    messagingSettings: MessagingSettings,
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      messagingSettings,
      ['INGESTS_EDIT', 'ADMIN'],
      new Logger({
        config,
        context: VideoSucceededHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload, metadata, id, aggregateId }: TypedTransactionalMessage<TContent>,
    loginClient: ClientBase,
  ): Promise<void> {
    if (!checkIsIngestEvent(metadata, this.logger, id, aggregateId)) {
      return;
    }
    const messageContext = metadata.messageContext as VideoMessageContext;
    const ingestItem = await selectExactlyOne('ingest_items', {
      id: messageContext.ingestItemId,
    }).run(loginClient);

    const processor = this.entityProcessors.find(
      (h) => h.type === ingestItem.type,
    );

    if (!processor) {
      throw new MosaicError({
        message: `Entity type '${ingestItem.type}' is not recognized. Please make sure that a correct ingest entity processor is registered for specified type.`,
        code: CommonErrors.IngestError.code,
      });
    }

    await processor.processVideo(
      ingestItem.entity_id,
      payload.video_id,
      messageContext,
      loginClient,
    );

    await update(
      'ingest_item_steps',
      { entity_id: payload.video_id },
      { id: messageContext.ingestItemStepId },
    ).run(loginClient);

    await this.storeOutboxMessage<CheckFinishIngestItemCommand>(
      messageContext.ingestItemId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      {
        ingest_item_step_id: messageContext.ingestItemStepId,
        ingest_item_id: messageContext.ingestItemId,
      },
      loginClient,
      {
        envelopeOverrides: { auth_token: metadata.authToken },
        lockedUntil: getFutureIsoDateInMilliseconds(1_000),
      },
    );
  }

  override async handleErrorMessage(
    error: Error,
    { metadata }: TypedTransactionalMessage<TContent>,
    loginClient: ClientBase,
    retry: boolean,
  ): Promise<void> {
    if (retry) {
      return;
    }
    const messageContext = metadata.messageContext as VideoMessageContext;

    await this.storeOutboxMessage<CheckFinishIngestItemCommand>(
      messageContext.ingestItemId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      {
        ingest_item_step_id: messageContext.ingestItemStepId,
        ingest_item_id: messageContext.ingestItemId,
        error_message: getIngestErrorMessage(
          error,
          'An unexpected error occurred while trying to update video relations.',
        ),
      },
      loginClient,
      { envelopeOverrides: { auth_token: metadata.authToken } },
    );
  }
}
