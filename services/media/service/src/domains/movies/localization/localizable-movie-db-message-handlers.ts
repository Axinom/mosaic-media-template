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
import { LOCALIZATION_MOVIE_TYPE } from './constants';
import { LocalizableMovieDbMessagingSettings } from './localizable-movie-db-messaging-settings';

export interface LocalizableMovieDbEvent {
  id: number;
  title?: string;
  description?: string;
  synopsis?: string;
}

export class LocalizableMovieCreatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableMovieDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableMovieDbMessagingSettings.LocalizableMovieCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id, ...fields },
  }: TransactionalInboxMessage<LocalizableMovieDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_MOVIE_TYPE,
      id,
      fields,
      fields.title,
      undefined, // Image is updated through movies_images changes
    );
  }
}

export class LocalizableMovieUpdatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableMovieDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableMovieDbMessagingSettings.LocalizableMovieUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id, ...fields },
  }: TransactionalInboxMessage<LocalizableMovieDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_MOVIE_TYPE,
      id,
      fields,
      fields.title,
      undefined, // Image is updated through movies_images changes
    );
  }
}

export class LocalizableMovieDeletedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableMovieDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableMovieDbMessagingSettings.LocalizableMovieDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id },
  }: TransactionalInboxMessage<LocalizableMovieDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getDeleteMessageData(
      this.config.serviceId,
      LOCALIZATION_MOVIE_TYPE,
      id,
    );
  }
}
