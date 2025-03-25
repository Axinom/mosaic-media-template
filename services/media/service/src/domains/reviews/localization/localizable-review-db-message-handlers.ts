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
import { LOCALIZATION_REVIEW_TYPE } from './constants';
import { LocalizableReviewDbMessagingSettings } from './localizable-review-db-messaging-settings';

export interface LocalizableReviewDbEvent {
  id: number;
  title?: string;
  description?: string;
}

export class LocalizableReviewCreatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableReviewDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableReviewDbMessagingSettings.LocalizableReviewCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id, ...fields },
  }: TypedTransactionalMessage<LocalizableReviewDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_REVIEW_TYPE,
      id,
      fields,
      fields.title,
      undefined,
    );
  }
}

export class LocalizableReviewUpdatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableReviewDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableReviewDbMessagingSettings.LocalizableReviewUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id, ...fields },
  }: TypedTransactionalMessage<LocalizableReviewDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_REVIEW_TYPE,
      id,
      fields,
      fields.title,
      undefined,
    );
  }
}

export class LocalizableReviewDeletedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableReviewDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableReviewDbMessagingSettings.LocalizableReviewDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id },
  }: TypedTransactionalMessage<LocalizableReviewDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getDeleteMessageData(
      this.config.serviceId,
      LOCALIZATION_REVIEW_TYPE,
      id,
    );
  }
}
