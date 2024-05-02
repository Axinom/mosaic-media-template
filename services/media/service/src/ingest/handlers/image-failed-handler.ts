import {
  EnsureImageExistsFailedEvent,
  ImageServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ImageMessageContext } from 'media-messages';
import { ClientBase } from 'pg';
import { update } from 'zapatos/db';
import { CommonErrors, Config, getMediaMappedError } from '../../common';
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

  public override mapError(error: unknown): Error {
    return getMediaMappedError(error, {
      message:
        'Processing of image has failed and there was an error updating the ingest item step status.',
      code: CommonErrors.IngestError.code,
    });
  }

  override async handleErrorMessage(
    error: Error,
    { metadata }: TypedTransactionalMessage<EnsureImageExistsFailedEvent>,
    ownerClient: ClientBase,
    retry: boolean,
  ): Promise<void> {
    if (retry) {
      return;
    }
    const messageContext = metadata.messageContext as ImageMessageContext;

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
