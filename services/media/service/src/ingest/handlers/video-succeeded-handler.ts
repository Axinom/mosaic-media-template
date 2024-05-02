import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import {
  EnsureVideoExistsAlreadyExistedEvent,
  EnsureVideoExistsCreationStartedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { VideoMessageContext } from 'media-messages';
import { ClientBase } from 'pg';
import { selectExactlyOne, update } from 'zapatos/db';
import { CommonErrors, Config, getMediaMappedError } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import { IngestEntityProcessor } from '../models';
import { checkIsIngestEvent } from '../utils/check-is-ingest-event';

export abstract class VideoSucceededHandler<
  TContent extends
    | EnsureVideoExistsAlreadyExistedEvent
    | EnsureVideoExistsCreationStartedEvent,
> extends MediaGuardedTransactionalInboxMessageHandler<TContent> {
  constructor(
    private entityProcessors: IngestEntityProcessor[],
    messagingSettings: MessagingSettings,
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
    ownerClient: ClientBase,
  ): Promise<void> {
    if (!checkIsIngestEvent(metadata, this.logger, id, aggregateId)) {
      return;
    }
    const messageContext = metadata.messageContext as VideoMessageContext;
    const ingestItem = await selectExactlyOne('ingest_items', {
      id: messageContext.ingestItemId,
    }).run(ownerClient);

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
      ownerClient,
    );

    await update(
      'ingest_item_steps',
      { status: 'SUCCESS', entity_id: payload.video_id },
      { id: messageContext.ingestItemStepId },
    ).run(ownerClient);
  }

  public override mapError(error: unknown): Error {
    const fallbackMessage =
      this.messagingSettings.messageType ===
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsAlreadyExisted
        .messageType
        ? 'The video already existed, but there was an error adding that video to the entity.'
        : 'The video encoding has started, but there was an error adding that video to the entity.';
    return getMediaMappedError(error, {
      message: fallbackMessage,
      code: CommonErrors.IngestError.code,
    });
  }

  override async handleErrorMessage(
    error: Error,
    { metadata }: TypedTransactionalMessage<TContent>,
    ownerClient: ClientBase,
    retry: boolean,
  ): Promise<void> {
    if (retry) {
      return;
    }
    const messageContext = metadata.messageContext as VideoMessageContext;

    await update(
      'ingest_item_steps',
      {
        status: 'ERROR',
        response_message: error.message,
      },
      { id: messageContext.ingestItemStepId },
    ).run(ownerClient);
  }
}
