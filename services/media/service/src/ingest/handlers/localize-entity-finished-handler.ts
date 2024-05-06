import {
  LocalizationServiceMultiTenantMessagingSettings,
  LocalizeEntityFinishedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ImageMessageContext, IngestMessageContext } from 'media-messages';
import { ClientBase } from 'pg';
import { update } from 'zapatos/db';
import { CommonErrors, Config, getMediaMappedError } from '../../common';
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

  public override mapError(error: unknown): Error {
    return getMediaMappedError(error, {
      message:
        'Processing of localization(s) was successful, but there was an error updating the ingest item step status.',
      code: CommonErrors.IngestError.code,
    });
  }

  override async handleErrorMessage(
    error: Error,
    { metadata }: TypedTransactionalMessage<LocalizeEntityFinishedEvent>,
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
