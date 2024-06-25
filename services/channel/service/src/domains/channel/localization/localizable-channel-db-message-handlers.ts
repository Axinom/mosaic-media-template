import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config, LOCALIZATION_CHANNEL_TYPE } from '../../../common';
import {
  getLocalizationDeleteMessageData,
  getLocalizationUpsertMessageData,
  LocalizableTransactionalInboxMessageHandler,
  LocalizationMessageData,
} from '../../../localization';
import { LocalizableChannelDbMessagingSettings } from './localizable-channel-db-messaging-settings';

export interface LocalizableChannelDbEvent {
  id: string;
  title?: string;
  description?: string;
  synopsis?: string;
}

export class LocalizableChannelCreatedDbMessageHandler extends LocalizableTransactionalInboxMessageHandler<LocalizableChannelDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableChannelDbMessagingSettings.LocalizableChannelCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id, ...fields },
  }: TypedTransactionalMessage<LocalizableChannelDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getLocalizationUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_CHANNEL_TYPE,
      id,
      fields,
      fields.title,
      undefined, // Image is updated through channels_images changes
    );
  }
}

export class LocalizableChannelUpdatedDbMessageHandler extends LocalizableTransactionalInboxMessageHandler<LocalizableChannelDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableChannelDbMessagingSettings.LocalizableChannelUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id, ...fields },
  }: TypedTransactionalMessage<LocalizableChannelDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getLocalizationUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_CHANNEL_TYPE,
      id,
      fields,
      fields.title,
      undefined, // Image is updated through channels_images changes
    );
  }
}

export class LocalizableChannelDeletedDbMessageHandler extends LocalizableTransactionalInboxMessageHandler<LocalizableChannelDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableChannelDbMessagingSettings.LocalizableChannelDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id },
  }: TypedTransactionalMessage<LocalizableChannelDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getLocalizationDeleteMessageData(
      this.config.serviceId,
      LOCALIZATION_CHANNEL_TYPE,
      id,
    );
  }
}
