import {
  StoreOutboxMessage,
  TransactionalInboxMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { selectOne } from 'zapatos/db';
import { Config } from '../../../common';
import {
  getUpsertMessageData,
  LocalizableMediaTransactionalInboxMessageHandler,
  LocalizationMessageData,
} from '../../common';
import { LOCALIZATION_EPISODE_TYPE } from './constants';
import { LocalizableEpisodeDbMessagingSettings } from './localizable-episode-db-messaging-settings';

export interface LocalizableEpisodeImageDbEvent {
  episode_id: number;
  image_id: string;
  image_type: string;
}

export class LocalizableEpisodeImageCreatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableEpisodeImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeImageCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { image_type, episode_id, image_id },
  }: TransactionalInboxMessage<LocalizableEpisodeImageDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    if (image_type !== 'COVER') {
      // Ignore any changes to non-cover image relations
      return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_EPISODE_TYPE,
      episode_id,
      {}, // Localizable fields are never updated on image assignment
      undefined, // Title is never updated on image assignment
      image_id,
    );
  }
}

export class LocalizableEpisodeImageUpdatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableEpisodeImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeImageUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { image_type, episode_id, image_id },
  }: TransactionalInboxMessage<LocalizableEpisodeImageDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    if (image_type !== 'COVER') {
      // Ignore any changes to non-cover image relations
      return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_EPISODE_TYPE,
      episode_id,
      {}, // Localizable fields are never updated on image assignment
      undefined, // Title is never updated on image assignment
      image_id,
    );
  }
}

export class LocalizableEpisodeImageDeletedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableEpisodeImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeImageDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData(
    {
      payload: { image_type, episode_id },
    }: TransactionalInboxMessage<LocalizableEpisodeImageDbEvent>,
    loginClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    if (
      image_type !== 'COVER' ||
      (await this.episodeIsDeleted(episode_id, loginClient))
    ) {
      // Ignore any changes to non-cover image relations
      // If image relation is deleted as part of a cascade delete of episode - no need to upsert
      return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_EPISODE_TYPE,
      episode_id,
      {}, // Localizable fields are never updated on image unassign
      undefined, // Title is never updated on image unassign
      null, // Explicit unassign of an image
    );
  }

  async episodeIsDeleted(
    episodeId: number,
    loginClient: ClientBase,
  ): Promise<boolean> {
    const data = await selectOne(
      'episodes',
      { id: episodeId },
      { columns: ['id'] },
    ).run(loginClient);
    return !data;
  }
}
