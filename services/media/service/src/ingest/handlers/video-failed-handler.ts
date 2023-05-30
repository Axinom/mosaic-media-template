import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  EnsureVideoExistsFailedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  CheckFinishIngestItemCommand,
  MediaServiceMessagingSettings,
  VideoMessageContext,
} from 'media-messages';
import { SubscriptionConfig } from 'rascal';
import { Config } from '../../common';
import { MediaGuardedMessageHandler } from '../../messaging';
import { skipNonIngestEventsMiddleware } from '../middleware';

export class VideoFailedHandler extends MediaGuardedMessageHandler<EnsureVideoExistsFailedEvent> {
  constructor(
    private broker: Broker,
    config: Config,
    overrides?: SubscriptionConfig,
  ) {
    super(
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsFailed
        .messageType,
      ['INGESTS_EDIT', 'ADMIN'],
      config,
      overrides,
      [
        skipNonIngestEventsMiddleware(
          new Logger({ config, context: VideoFailedHandler.name }),
        ),
      ],
    );
  }

  async onMessage(
    content: EnsureVideoExistsFailedEvent,
    message: MessageInfo,
  ): Promise<void> {
    const messageContext = message.envelope
      .message_context as VideoMessageContext;

    await this.broker.publish<CheckFinishIngestItemCommand>(
      MediaServiceMessagingSettings.CheckFinishIngestItem.messageType,
      {
        ingest_item_step_id: messageContext.ingestItemStepId,
        ingest_item_id: messageContext.ingestItemId,
        error_message: content.message,
      },
      { auth_token: message.envelope.auth_token },
    );
  }
}
