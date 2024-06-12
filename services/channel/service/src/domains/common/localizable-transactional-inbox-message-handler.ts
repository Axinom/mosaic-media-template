import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import {
  DeleteLocalizationSourceEntityCommand,
  LocalizationServiceMultiTenantMessagingSettings,
  UpsertLocalizationSourceEntityCommand,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { Config, requestServiceAccountToken } from '../../common';
import { ChannelTransactionalInboxMessageHandler } from '../../messaging';

export interface LocalizationMessageData {
  settings: LocalizationServiceMultiTenantMessagingSettings;
  payload:
    | DeleteLocalizationSourceEntityCommand
    | UpsertLocalizationSourceEntityCommand;
}

export abstract class LocalizableTransactionalInboxMessageHandler<
  T,
> extends ChannelTransactionalInboxMessageHandler<T, Config> {
  constructor(
    messagingSettings: MessagingSettings,
    protected readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      messagingSettings,
      new Logger({
        config,
        context: messagingSettings.messageType,
      }),
      config,
    );
  }

  abstract getLocalizationCommandData(
    message: TypedTransactionalMessage<T>,
    ownerClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined>;

  async additionalWork(
    _message: TypedTransactionalMessage<T>,
    _ownerClient: ClientBase,
    _accessToken: string,
  ): Promise<void> {
    /* can be overridden */
  }

  override async handleMessage(
    message: TypedTransactionalMessage<T>,
    ownerClient: ClientBase,
  ): Promise<void> {
    const data = await this.getLocalizationCommandData(message, ownerClient);
    if (!data) {
      return;
    }

    const accessToken = await requestServiceAccountToken(this.config);
    await this.storeOutboxMessage(
      data.payload.entity_id,
      data.settings,
      data.payload,
      ownerClient,
      {
        envelopeOverrides: {
          auth_token: accessToken,
        },
        options: {
          routingKey: data.settings.getEnvironmentRoutingKey({
            tenantId: this.config.tenantId,
            environmentId: this.config.environmentId,
          }),
        },
      },
    );
    await this.additionalWork(message, ownerClient, accessToken);
  }
}
