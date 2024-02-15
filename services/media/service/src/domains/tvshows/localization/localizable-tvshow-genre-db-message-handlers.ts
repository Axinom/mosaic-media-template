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
import { LOCALIZATION_TVSHOW_GENRE_TYPE } from './constants';
import { LocalizableTvshowDbMessagingSettings } from './localizable-tvshow-db-messaging-settings';

export interface LocalizableTvshowGenreDbEvent {
  id: number;
  title?: string;
}

export class LocalizableTvshowGenreCreatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableTvshowGenreDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableTvshowDbMessagingSettings.LocalizableTvshowGenreCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id, ...fields },
  }: TransactionalInboxMessage<LocalizableTvshowGenreDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_TVSHOW_GENRE_TYPE,
      id,
      fields,
      fields.title,
      undefined, // Genres have no image relations
    );
  }
}

export class LocalizableTvshowGenreUpdatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableTvshowGenreDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableTvshowDbMessagingSettings.LocalizableTvshowGenreUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id, ...fields },
  }: TransactionalInboxMessage<LocalizableTvshowGenreDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_TVSHOW_GENRE_TYPE,
      id,
      fields,
      fields.title,
      undefined, // Genres have no image relations
    );
  }
}

export class LocalizableTvshowGenreDeletedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableTvshowGenreDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableTvshowDbMessagingSettings.LocalizableTvshowGenreDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id },
  }: TransactionalInboxMessage<LocalizableTvshowGenreDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getDeleteMessageData(
      this.config.serviceId,
      LOCALIZATION_TVSHOW_GENRE_TYPE,
      id,
    );
  }
}
