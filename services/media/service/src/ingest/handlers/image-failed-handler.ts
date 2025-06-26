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

    // If the ingest of a localized image fails, we also fail the localization step.
    if (messageContext.isLocalization) {
      await update(
        'ingest_item_steps',
        {
          status: 'ERROR',
          response_message:
            'Image ingest failed. Cannot proceed with localization.',
        },
        {
          ingest_item_id: messageContext.ingestItemId,
          type: 'IMAGE_LOCALIZATIONS',
          // At the moment, we mark all image localizations as error as well, since we send them all in one message.
          // TODO: Improve this to so images are localized independently.
          //sub_type: messageContext.imageType,
          //language_tag: messageContext.languageTag,
        },
      ).run(ownerClient);
    }
  }
}
