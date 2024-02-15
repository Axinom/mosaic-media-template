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
import { LOCALIZATION_MOVIE_GENRE_TYPE } from './constants';
import { LocalizableMovieDbMessagingSettings } from './localizable-movie-db-messaging-settings';

export interface LocalizableMovieGenreDbEvent {
  id: number;
  title?: string;
}

export class LocalizableMovieGenreCreatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableMovieGenreDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableMovieDbMessagingSettings.LocalizableMovieGenreCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id, ...fields },
  }: TransactionalInboxMessage<LocalizableMovieGenreDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_MOVIE_GENRE_TYPE,
      id,
      fields,
      fields.title,
      undefined, // Genres have no image relations
    );
  }
}

export class LocalizableMovieGenreUpdatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableMovieGenreDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableMovieDbMessagingSettings.LocalizableMovieGenreUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id, ...fields },
  }: TransactionalInboxMessage<LocalizableMovieGenreDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_MOVIE_GENRE_TYPE,
      id,
      fields,
      fields.title,
      undefined, // Genres have no image relations
    );
  }
}

export class LocalizableMovieGenreDeletedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableMovieGenreDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableMovieDbMessagingSettings.LocalizableMovieGenreDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id },
  }: TransactionalInboxMessage<LocalizableMovieGenreDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getDeleteMessageData(
      this.config.serviceId,
      LOCALIZATION_MOVIE_GENRE_TYPE,
      id,
    );
  }
}
