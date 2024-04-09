import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { parent, selectOne } from 'zapatos/db';
import { Config } from '../../../common';
import {
  buildDisplayTitle,
  getDeleteMessageData,
  getUpsertMessageData,
  LocalizableMediaTransactionalInboxMessageHandler,
  LocalizationMessageData,
} from '../../common';
import { LOCALIZATION_EPISODE_TYPE } from './constants';
import { LocalizableEpisodeDbMessagingSettings } from './localizable-episode-db-messaging-settings';

export interface LocalizableEpisodeDbEvent {
  id: number;
  index: number;
  season_id?: number;
  title?: string;
  description?: string;
  synopsis?: string;
}

const getEntityTitle = async (
  episode: LocalizableEpisodeDbEvent,
  ownerClient: ClientBase,
): Promise<string> => {
  const season = episode.season_id
    ? await selectOne(
        'seasons',
        { id: episode.season_id },
        {
          columns: ['tvshow_id', 'index'],
          lateral: {
            tvshow: selectOne(
              'tvshows',
              { id: parent('tvshow_id') },
              { columns: ['title'] },
            ),
          },
        },
      ).run(ownerClient)
    : undefined;
  return buildDisplayTitle('EPISODE', episode, season, season?.tvshow);
};

export class LocalizableEpisodeCreatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableEpisodeDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData(
    { payload }: TypedTransactionalMessage<LocalizableEpisodeDbEvent>,
    ownerClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    const entityTitle = await getEntityTitle(payload, ownerClient);
    const { id, index, season_id, ...fields } = payload;
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_EPISODE_TYPE,
      id,
      fields,
      entityTitle,
      undefined, // Image is updated through episodes_images changes
    );
  }
}

export class LocalizableEpisodeUpdatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableEpisodeDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData(
    { payload }: TypedTransactionalMessage<LocalizableEpisodeDbEvent>,
    ownerClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    const entityTitle = await getEntityTitle(payload, ownerClient);
    const { id, index, season_id, ...fields } = payload;
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_EPISODE_TYPE,
      id,
      fields,
      entityTitle,
      undefined, // Image is updated through episodes_images changes
    );
  }
}

export class LocalizableEpisodeDeletedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableEpisodeDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id },
  }: TypedTransactionalMessage<LocalizableEpisodeDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getDeleteMessageData(
      this.config.serviceId,
      LOCALIZATION_EPISODE_TYPE,
      id,
    );
  }
}
