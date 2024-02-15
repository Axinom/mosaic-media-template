import {
  StoreOutboxMessage,
  TransactionalInboxMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../../common';
import {
  getDeleteMessageData,
  getUpsertMessageData,
  LocalizableMediaTransactionalInboxMessageHandler,
  LocalizationMessageData,
} from '../../common';
import { LOCALIZATION_TVSHOW_TYPE } from './constants';
import { LocalizableTvshowDbMessagingSettings } from './localizable-tvshow-db-messaging-settings';

export interface LocalizableTvshowDbEvent {
  id: number;
  title?: string;
  description?: string;
  synopsis?: string;
}

export class LocalizableTvshowCreatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableTvshowDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableTvshowDbMessagingSettings.LocalizableTvshowCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id, ...fields },
  }: TransactionalInboxMessage<LocalizableTvshowDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_TVSHOW_TYPE,
      id,
      fields,
      fields.title,
      undefined, // Image is updated through tvshows_images changes
    );
  }
}

export class LocalizableTvshowUpdatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableTvshowDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableTvshowDbMessagingSettings.LocalizableTvshowUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id, ...fields },
  }: TransactionalInboxMessage<LocalizableTvshowDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_TVSHOW_TYPE,
      id,
      fields,
      fields.title,
      undefined, // Image is updated through tvshows_images changes
    );
  }
}

export class LocalizableTvshowDeletedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableTvshowDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableTvshowDbMessagingSettings.LocalizableTvshowDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id },
  }: TransactionalInboxMessage<LocalizableTvshowDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getDeleteMessageData(
      this.config.serviceId,
      LOCALIZATION_TVSHOW_TYPE,
      id,
    );
  }
}
