import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
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
  }: TypedTransactionalMessage<LocalizableEpisodeImageDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    let fields = {};
    switch (image_type) {
      case 'EPISODE_COVER':
        fields = { episode_cover: image_id };
        break;
      case 'EPISODE_COVER_1x1':
        fields = { episode_cover_1x1: image_id };
        break;
      case 'EPISODE_COVER_16x9':
        fields = { episode_cover_16x9: image_id };
        break;
      case 'EPISODE_CLEAN_COVER':
        fields = { episode_clean_cover: image_id };
        break;
      case 'EPISODE_CLEAN_COVER_1x1':
        fields = { episode_clean_cover_1x1: image_id };
        break;
      case 'EPISODE_CLEAN_COVER_16x9':
        fields = { episode_clean_cover_16x9: image_id };
        break;
      case 'EPISODE_LIST':
        fields = { episode_list: image_id };
        break;
      case 'EPISODE_LIST_1x1':
        fields = { episode_list_1x1: image_id };
        break;
      case 'EPISODE_LIST_9x13':
        fields = { episode_list_9x13: image_id };
        break;
      default:
        return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_EPISODE_TYPE,
      episode_id,
      fields, // Localizable fields are never updated on image assignment
      undefined, // Title is never updated on image assignment
      undefined,
      `${episode_id}-${image_type}`,
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
  }: TypedTransactionalMessage<LocalizableEpisodeImageDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    let fields = {};
    switch (image_type) {
      case 'EPISODE_COVER':
        fields = { episode_cover: image_id };
        break;
      case 'EPISODE_COVER_1x1':
        fields = { episode_cover_1x1: image_id };
        break;
      case 'EPISODE_COVER_16x9':
        fields = { episode_cover_16x9: image_id };
        break;
      case 'EPISODE_CLEAN_COVER':
        fields = { episode_clean_cover: image_id };
        break;
      case 'EPISODE_CLEAN_COVER_1x1':
        fields = { episode_clean_cover_1x1: image_id };
        break;
      case 'EPISODE_CLEAN_COVER_16x9':
        fields = { episode_clean_cover_16x9: image_id };
        break;
      case 'EPISODE_LIST':
        fields = { episode_list: image_id };
        break;
      case 'EPISODE_LIST_1x1':
        fields = { episode_list_1x1: image_id };
        break;
      case 'EPISODE_LIST_9x13':
        fields = { episode_list_9x13: image_id };
        break;
      default:
        return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_EPISODE_TYPE,
      episode_id,
      fields, // Localizable fields are never updated on image assignment
      undefined, // Title is never updated on image assignment
      undefined,
      `${episode_id}-${image_type}`,
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
    }: TypedTransactionalMessage<LocalizableEpisodeImageDbEvent>,
    ownerClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    if (await this.episodeIsDeleted(episode_id, ownerClient)) {
      // Ignore any changes to non-cover image relations
      // If image relation is deleted as part of a cascade delete of episode - no need to upsert
      return undefined;
    } else {
      let fields = {};
      switch (image_type) {
        case 'EPISODE_COVER':
          fields = { episode_cover: '' };
          break;
        case 'EPISODE_COVER_1x1':
          fields = { episode_cover_1x1: '' };
          break;
        case 'EPISODE_COVER_16x9':
          fields = { episode_cover_16x9: '' };
          break;
        case 'EPISODE_CLEAN_COVER':
          fields = { episode_clean_cover: '' };
          break;
        case 'EPISODE_CLEAN_COVER_1x1':
          fields = { episode_clean_cover_1x1: '' };
          break;
        case 'EPISODE_CLEAN_COVER_16x9':
          fields = { episode_clean_cover_16x9: '' };
          break;
        case 'EPISODE_LIST':
          fields = { episode_list: '' };
          break;
        case 'EPISODE_LIST_1x1':
          fields = { episode_list_1x1: '' };
          break;
        case 'EPISODE_LIST_9x13':
          fields = { episode_list_9x13: '' };
          break;
        default:
          return undefined;
      }

      return getUpsertMessageData(
        this.config.serviceId,
        LOCALIZATION_EPISODE_TYPE,
        episode_id,
        fields, // Localizable fields are never updated on image unassign
        undefined, // Title is never updated on image unassign
        undefined, // Explicit unassign of an image
        `${episode_id}-${image_type}`,
      );
    }
  }

  async episodeIsDeleted(
    episodeId: number,
    ownerClient: ClientBase,
  ): Promise<boolean> {
    const data = await selectOne(
      'episodes',
      { id: episodeId },
      { columns: ['id'] },
    ).run(ownerClient);
    return !data;
  }
}
