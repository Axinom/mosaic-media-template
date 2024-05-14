import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config, LOCALIZATION_CHANNEL_TYPE } from '../../../common';
import { getDeleteMessageData, getUpsertMessageData } from '../../common';
import {
  LocalizableTransactionalInboxMessageHandler,
  LocalizationMessageData,
} from '../../common/localizable-transactional-inbox-message-handler';
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
    return getUpsertMessageData(
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
    return getUpsertMessageData(
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
    return getDeleteMessageData(
      this.config.serviceId,
      LOCALIZATION_CHANNEL_TYPE,
      id,
    );
  }
}
