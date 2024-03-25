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
    if (image_type !== 'COVER') {
      // Ignore any changes to non-cover image relations
      return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_TVSHOW_TYPE,
      tvshow_id,
      {}, // Localizable fields are never updated on image assignment
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
    if (image_type !== 'COVER') {
      // Ignore any changes to non-cover image relations
      return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_TVSHOW_TYPE,
      tvshow_id,
      {}, // Localizable fields are never updated on image assignment
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
    loginClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    if (
      image_type !== 'COVER' ||
      (await this.tvshowIsDeleted(tvshow_id, loginClient))
    ) {
      // Ignore any changes to non-cover image relations
      // If image relation is deleted as part of a cascade delete of tvshow - no need to upsert
      return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_TVSHOW_TYPE,
      tvshow_id,
      {}, // Localizable fields are never updated on image unassign
      undefined, // Title is never updated on image unassign
      null, // Explicit unassign of an image
    );
  }

  async tvshowIsDeleted(
    tvshowId: number,
    loginClient: ClientBase,
  ): Promise<boolean> {
    const data = await selectOne(
      'tvshows',
      { id: tvshowId },
      { columns: ['id'] },
    ).run(loginClient);
    return !data;
  }
}
