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
import { LOCALIZATION_SEASON_TYPE } from './constants';
import { LocalizableSeasonDbMessagingSettings } from './localizable-season-db-messaging-settings';

export interface LocalizableSeasonImageDbEvent {
  season_id: number;
  image_id: string;
  image_type: string;
}

export class LocalizableSeasonImageCreatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableSeasonImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableSeasonDbMessagingSettings.LocalizableSeasonImageCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { image_type, season_id, image_id },
  }: TypedTransactionalMessage<LocalizableSeasonImageDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    let fields = {};
    switch (image_type) {
      case 'SEASON_COVER_1x1':
        fields = { season_cover_1x1: image_id };
        break;
      case 'SEASON_COVER_16x9':
        fields = { seasoncover_16x9: image_id };
        break;
      case 'SEASON_CLEAN_COVER_1x1':
        fields = { season_clean_cover_1x1: image_id };
        break;
      case 'SEASON_CLEAN_COVER_16x9':
        fields = { season_clean_cover_16x9: image_id };
        break;
      case 'SEASON_LIST_1x1':
        fields = { season_list_1x1: image_id };
        break;
      case 'SEASON_LIST_9x13':
        fields = { season_list_9x13: image_id };
        break;
      default:
        return undefined;
    }
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_SEASON_TYPE,
      season_id,
      fields, // Localizable fields are never updated on image assignment
      undefined, // Title is never updated on image assignment
      undefined,
      `${season_id}-${image_type}`,
    );
  }
}

export class LocalizableSeasonImageUpdatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableSeasonImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableSeasonDbMessagingSettings.LocalizableSeasonImageUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { image_type, season_id, image_id },
  }: TypedTransactionalMessage<LocalizableSeasonImageDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    let fields = {};
    switch (image_type) {
      case 'SEASON_COVER_1x1':
        fields = { season_cover_1x1: image_id };
        break;
      case 'SEASON_COVER_16x9':
        fields = { season_cover_16x9: image_id };
        break;
      case 'SEASON_CLEAN_COVER_1x1':
        fields = { season_clean_cover_1x1: image_id };
        break;
      case 'SEASON_CLEAN_COVER_16x9':
        fields = { season_clean_cover_16x9: image_id };
        break;
      case 'SEASON_LIST_1x1':
        fields = { season_list_1x1: image_id };
        break;
      case 'SEASON_LIST_9x13':
        fields = { season_list_9x13: image_id };
        break;
      default:
        return undefined;
    }
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_SEASON_TYPE,
      season_id,
      fields, // Localizable fields are never updated on image assignment
      undefined, // Title is never updated on image assignment
      undefined,
      `${season_id}-${image_type}`,
    );
  }
}

export class LocalizableSeasonImageDeletedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableSeasonImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableSeasonDbMessagingSettings.LocalizableSeasonImageDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData(
    {
      payload: { image_type, season_id },
    }: TypedTransactionalMessage<LocalizableSeasonImageDbEvent>,
    ownerClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    if (await this.seasonIsDeleted(season_id, ownerClient)) {
      // Ignore any changes to non-cover image relations
      // If image relation is deleted as part of a cascade delete of season - no need to upsert
      return undefined;
    } else {
      let fields = {};
      switch (image_type) {
        case 'SEASON_COVER_1x1':
          fields = { season_cover_1x1: '' };
          break;
        case 'SEASON_COVER_16x9':
          fields = { season_cover_16x9: '' };
          break;
        case 'SEASON_CLEAN_COVER_1x1':
          fields = { season_clean_cover_1x1: '' };
          break;
        case 'SEASON_CLEAN_COVER_16x9':
          fields = { season_clean_cover_16x9: '' };
          break;
        case 'SEASON_LIST_1x1':
          fields = { season_list_1x1: '' };
          break;
        case 'SEASON_LIST_9x13':
          fields = { season_list_9x13: '' };
          break;
        default:
          return undefined;
      }
      return getUpsertMessageData(
        this.config.serviceId,
        LOCALIZATION_SEASON_TYPE,
        season_id,
        fields, // Localizable fields are never updated on image unassign
        undefined, // Title is never updated on image unassign
        undefined,
        `${season_id}-${image_type}`,
      );
    }
  }

  async seasonIsDeleted(
    seasonId: number,
    ownerClient: ClientBase,
  ): Promise<boolean> {
    const data = await selectOne(
      'seasons',
      { id: seasonId },
      { columns: ['id'] },
    ).run(ownerClient);
    return !data;
  }
}
