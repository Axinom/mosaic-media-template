import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { Dict, Logger } from '@axinom/mosaic-service-common';
import {
  DbConfig,
  StoreOutboxMessage,
  TransactionalInboxMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { Config, requestServiceAccountToken } from '../../../common';
import { MediaTransactionalInboxMessageHandler } from '../../../messaging';
import { LocalizationMessageData } from '../models';

export abstract class LocalizableMediaTransactionalInboxMessageHandler<
  T,
> extends MediaTransactionalInboxMessageHandler<
  T,
  Dict<unknown>,
  DbConfig & Config
> {
  constructor(
    messagingSettings: MessagingSettings,
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      messagingSettings,
      new Logger({
        config,
        context: messagingSettings.messageType,
      }),
      config as any, // TODO: Remove casts when mosaic transactional outbox lib is updated
    );
  }

  abstract getLocalizationCommandData(
    message: TransactionalInboxMessage<T>,
    loginClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined>;

  override async handleMessage(
    message: TransactionalInboxMessage<T>,
    loginClient: ClientBase,
  ): Promise<void> {
    const data = await this.getLocalizationCommandData(message, loginClient);
    if (!data) {
      return;
    }

    const accessToken = await requestServiceAccountToken(this.config);
    await this.storeOutboxMessage(
      data.payload.entity_id,
      data.settings,
      data.payload,
      loginClient,
      {
        auth_token: accessToken,
        // If update happened in context of an ingest UpdateMetadata handling,
        // this would include ingestItemId
        message_context: message.metadata?.messageContext,
      },
      {
        routingKey: data.settings.getEnvironmentRoutingKey({
          tenantId: this.config.tenantId,
          environmentId: this.config.environmentId,
        }),
      },
    );
  }
}
