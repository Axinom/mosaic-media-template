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
import { LOCALIZATION_TVSHOW_TYPE } from './constants';
import { LocalizableTvshowDbMessagingSettings } from './localizable-tvshow-db-messaging-settings';

export interface LocalizableTvshowImageDbEvent {
  tvshow_id: number;
  image_id: string;
  image_type: string;
}

export class LocalizableTvshowImageCreatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableTvshowImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableTvshowDbMessagingSettings.LocalizableTvshowImageCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { image_type, tvshow_id, image_id },
  }: TypedTransactionalMessage<LocalizableTvshowImageDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    let fields = {};
    switch (image_type) {
      case 'COVER_1x1':
        fields = { image_id_cover_1x1: image_id };
        break;
      case 'COVER_16x9':
        fields = { image_id_cover_16x9: image_id };
        break;
      case 'CLEAN_COVER_1x1':
        fields = { image_id_clean_cover_1x1: image_id };
        break;
      case 'CLEAN_COVER_16x9':
        fields = { image_id_clean_cover_16x9: image_id };
        break;
      case 'LIST_1x1':
        fields = { image_id_list_1x1: image_id };
        break;
      case 'LIST_9x13':
        fields = { image_id_list_9x13: image_id };
        break;
      default:
        return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_TVSHOW_TYPE,
      tvshow_id,
      fields, // localizable image id fields
      undefined, // Title is never updated on image assignment
      image_id,
    );
  }
}

export class LocalizableTvshowImageUpdatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableTvshowImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableTvshowDbMessagingSettings.LocalizableTvshowImageUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { image_type, tvshow_id, image_id },
  }: TypedTransactionalMessage<LocalizableTvshowImageDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    let fields = {};
    switch (image_type) {
      case 'COVER_1x1':
        fields = { image_id_cover_1x1: image_id };
        break;
      case 'COVER_16x9':
        fields = { image_id_cover_16x9: image_id };
        break;
      case 'CLEAN_COVER_1x1':
        fields = { image_id_clean_cover_1x1: image_id };
        break;
      case 'CLEAN_COVER_16x9':
        fields = { image_id_clean_cover_16x9: image_id };
        break;
      case 'LIST_1x1':
        fields = { image_id_list_1x1: image_id };
        break;
      case 'LIST_9x13':
        fields = { image_id_list_9x13: image_id };
        break;
      default:
        return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_TVSHOW_TYPE,
      tvshow_id,
      fields, // localizable image id fields
      undefined, // Title is never updated on image assignment
      image_id,
    );
  }
}

export class LocalizableTvshowImageDeletedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableTvshowImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableTvshowDbMessagingSettings.LocalizableTvshowImageDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData(
    {
      payload: { image_type, tvshow_id },
    }: TypedTransactionalMessage<LocalizableTvshowImageDbEvent>,
    ownerClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    if (await this.tvshowIsDeleted(tvshow_id, ownerClient)) {
      // If image relation is deleted as part of a cascade delete of tvshow - no need to upsert
      return undefined;
    } else {
      let fields = {};
      switch (image_type) {
        case 'COVER_1x1':
          fields = { image_id_cover_1x1: '' };
          break;
        case 'COVER_16x9':
          fields = { image_id_cover_16x9: '' };
          break;
        case 'CLEAN_COVER_1x1':
          fields = { image_id_clean_cover_1x1: '' };
          break;
        case 'CLEAN_COVER_16x9':
          fields = { image_id_clean_cover_16x9: '' };
          break;
        case 'LIST_1x1':
          fields = { image_id_list_1x1: '' };
          break;
        case 'LIST_9x13':
          fields = { image_id_list_9x13: '' };
          break;
        default:
          return undefined;
      }
      return getUpsertMessageData(
        this.config.serviceId,
        LOCALIZATION_TVSHOW_TYPE,
        tvshow_id,
        fields, // localizable image id fields
        undefined, // Title is never updated on image unassign
        null, // Explicit unassign of an image
      );
    }
  }

  async tvshowIsDeleted(
    tvshowId: number,
    ownerClient: ClientBase,
  ): Promise<boolean> {
    const data = await selectOne(
      'tvshows',
      { id: tvshowId },
      { columns: ['id'] },
    ).run(ownerClient);
    return !data;
  }
}
