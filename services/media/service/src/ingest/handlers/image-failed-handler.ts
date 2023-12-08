import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  EnsureImageExistsFailedEvent,
  ImageServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  CheckFinishIngestItemCommand,
  ImageMessageContext,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { SubscriptionConfig } from 'rascal';
import { Config } from '../../common';
import { MediaGuardedMessageHandler } from '../../messaging';
import { skipNonIngestEventsMiddleware } from '../middleware';

export class ImageFailedHandler extends MediaGuardedMessageHandler<EnsureImageExistsFailedEvent> {
  constructor(
    private broker: Broker,
    config: Config,
    overrides?: SubscriptionConfig,
  ) {
    super(
      ImageServiceMultiTenantMessagingSettings.EnsureImageExistsFailed
        .messageType,
      ['INGESTS_EDIT', 'ADMIN'],
      config,
      overrides,
      [
        skipNonIngestEventsMiddleware(
          new Logger({ config, context: ImageFailedHandler.name }),
        ),
      ],
    );
  }

  async onMessage(
    content: EnsureImageExistsFailedEvent,
    message: MessageInfo,
  ): Promise<void> {
    const messageContext = message.envelope
      .message_context as ImageMessageContext;

    await this.broker.publish<CheckFinishIngestItemCommand>(
      messageContext.ingestItemId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      {
        ingest_item_step_id: messageContext.ingestItemStepId,
        ingest_item_id: messageContext.ingestItemId,
        error_message: content.message,
      },
      { auth_token: message.envelope.auth_token },
    );
  }
}
