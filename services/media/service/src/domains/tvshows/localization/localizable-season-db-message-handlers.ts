import {
  StoreOutboxMessage,
  TransactionalInboxMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { selectOne } from 'zapatos/db';
import { Config } from '../../../common';
import {
  buildDisplayTitle,
  getDeleteMessageData,
  getUpsertMessageData,
  LocalizableMediaTransactionalInboxMessageHandler,
  LocalizationMessageData,
} from '../../common';
import { LOCALIZATION_SEASON_TYPE } from './constants';
import { LocalizableSeasonDbMessagingSettings } from './localizable-season-db-messaging-settings';

export interface LocalizableSeasonDbEvent {
  id: number;
  index: number;
  tvshow_id?: number;
  description?: string;
  synopsis?: string;
}

const getEntityTitle = async (
  season: LocalizableSeasonDbEvent,
  loginClient: ClientBase,
): Promise<string> => {
  const tvshow = season.tvshow_id
    ? await selectOne(
        'tvshows',
        { id: season.tvshow_id },
        { columns: ['title'] },
      ).run(loginClient)
    : undefined;
  return buildDisplayTitle('SEASON', season, tvshow);
};

export class LocalizableSeasonCreatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableSeasonDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableSeasonDbMessagingSettings.LocalizableSeasonCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData(
    { payload }: TransactionalInboxMessage<LocalizableSeasonDbEvent>,
    loginClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    const entityTitle = await getEntityTitle(payload, loginClient);
    const { id, index, tvshow_id, ...fields } = payload;
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_SEASON_TYPE,
      id,
      fields,
      entityTitle,
      undefined, // Image is updated through seasons_images changes
    );
  }
}

export class LocalizableSeasonUpdatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableSeasonDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableSeasonDbMessagingSettings.LocalizableSeasonUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData(
    { payload }: TransactionalInboxMessage<LocalizableSeasonDbEvent>,
    loginClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    const entityTitle = await getEntityTitle(payload, loginClient);
    const { id, index, tvshow_id, ...fields } = payload;
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_SEASON_TYPE,
      id,
      fields,
      entityTitle,
      undefined, // Image is updated through seasons_images changes
    );
  }
}

export class LocalizableSeasonDeletedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableSeasonDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableSeasonDbMessagingSettings.LocalizableSeasonDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id },
  }: TransactionalInboxMessage<LocalizableSeasonDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getDeleteMessageData(
      this.config.serviceId,
      LOCALIZATION_SEASON_TYPE,
      id,
    );
  }
}
