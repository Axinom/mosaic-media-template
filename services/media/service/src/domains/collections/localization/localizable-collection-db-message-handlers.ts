import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../../common';
import {
  getDeleteMessageData,
  getUpsertMessageData,
  LocalizableMediaTransactionalInboxMessageHandler,
  LocalizationMessageData,
} from '../../common';
import { LOCALIZATION_COLLECTION_TYPE } from './constants';
import { LocalizableCollectionDbMessagingSettings } from './localizable-collection-db-messaging-settings';

export interface LocalizableCollectionDbEvent {
  id: number;
  title?: string;
  description?: string;
  synopsis?: string;
}

export class LocalizableCollectionCreatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableCollectionDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableCollectionDbMessagingSettings.LocalizableCollectionCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id, ...fields },
  }: TypedTransactionalMessage<LocalizableCollectionDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_COLLECTION_TYPE,
      id,
      fields,
      fields.title,
      undefined, // Image is updated through collections_images changes
    );
  }
}

export class LocalizableCollectionUpdatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableCollectionDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableCollectionDbMessagingSettings.LocalizableCollectionUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id, ...fields },
  }: TypedTransactionalMessage<LocalizableCollectionDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_COLLECTION_TYPE,
      id,
      fields,
      fields.title,
      undefined, // Image is updated through collections_images changes
    );
  }
}

export class LocalizableCollectionDeletedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableCollectionDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableCollectionDbMessagingSettings.LocalizableCollectionDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id },
  }: TypedTransactionalMessage<LocalizableCollectionDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getDeleteMessageData(
      this.config.serviceId,
      LOCALIZATION_COLLECTION_TYPE,
      id,
    );
  }
}
