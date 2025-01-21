import {
  LocalizationServiceMultiTenantMessagingSettings,
  LocalizeEntityFailedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  ImageLocalizationMessageContext,
  IngestMessageContext,
} from 'media-messages';
import { ClientBase } from 'pg';
import { conditions as c, update } from 'zapatos/db';
import { Config } from '../../common';
import { MediaTransactionalInboxMessageHandler } from '../../messaging';
import { checkIsIngestEvent } from '../utils/check-is-ingest-event';

export class LocalizeEntityFailedHandler extends MediaTransactionalInboxMessageHandler<LocalizeEntityFailedEvent> {
  constructor(config: Config) {
    super(
      LocalizationServiceMultiTenantMessagingSettings.LocalizeEntityFailed,
      new Logger({
        config,
        context: LocalizeEntityFailedHandler.name,
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
    }: TypedTransactionalMessage<LocalizeEntityFailedEvent>,
    ownerClient: ClientBase,
  ): Promise<void> {
    if (
      !checkIsIngestEvent(metadata, this.logger, id, aggregateId) ||
      payload.service_id !== this.config.serviceId
    ) {
      // skipping events for entity types from different services and non-ingest events
      return;
    }

    if (
      metadata.messageContext === undefined ||
      !(metadata.messageContext as ImageLocalizationMessageContext)
        .isImageLocalization
    ) {
      const messageContext = metadata.messageContext as IngestMessageContext;

      await update(
        'ingest_item_steps',
        {
          status: 'ERROR',
          response_message: payload.message,
        },
        { id: messageContext.ingestItemStepId },
      ).run(ownerClient);
    } else {
      // When we localize images, we have multiple ingest item steps for each image type.
      // We need to mark all of them as error.
      const messageContext =
        metadata.messageContext as ImageLocalizationMessageContext;

      await update(
        'ingest_item_steps',
        {
          status: 'ERROR',
          response_message: payload.message,
        },
        { id: c.isIn(messageContext.ingestItemStepIds) },
      ).run(ownerClient);
    }
  }
}
