import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  LocalizationServiceMultiTenantMessagingSettings,
  LocalizeEntityFinishedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  CheckFinishIngestItemCommand,
  IngestMessageContext,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { SubscriptionConfig } from 'rascal';
import { Config } from '../../common';
import { MediaGuardedMessageHandler } from '../../messaging';
import { skipNonIngestEventsMiddleware } from '../middleware';

export class LocalizeEntityFinishedHandler extends MediaGuardedMessageHandler<LocalizeEntityFinishedEvent> {
  constructor(
    private broker: Broker,
    config: Config,
    overrides?: SubscriptionConfig,
  ) {
    super(
      LocalizationServiceMultiTenantMessagingSettings.LocalizeEntityFinished
        .messageType,
      ['INGESTS_EDIT', 'ADMIN'],
      config,
      overrides,
      [
        skipNonIngestEventsMiddleware(
          new Logger({ config, context: LocalizeEntityFinishedHandler.name }),
        ),
      ],
    );
  }

  async onMessage(
    content: LocalizeEntityFinishedEvent,
    message: MessageInfo,
  ): Promise<void> {
    if (content.service_id !== this.config.serviceId) {
      // skipping message from different service
      return;
    }

    const messageContext = message.envelope
      .message_context as IngestMessageContext;

    await this.broker.publish<CheckFinishIngestItemCommand>(
      messageContext.ingestItemId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      {
        ingest_item_step_id: messageContext.ingestItemStepId,
        ingest_item_id: messageContext.ingestItemId,
      },
      { auth_token: message.envelope.auth_token },
    );
  }
}
