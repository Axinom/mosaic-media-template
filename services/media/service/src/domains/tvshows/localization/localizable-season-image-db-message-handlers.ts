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
    if (image_type !== 'COVER') {
      // Ignore any changes to non-cover image relations
      return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_SEASON_TYPE,
      season_id,
      {}, // Localizable fields are never updated on image assignment
      undefined, // Title is never updated on image assignment
      image_id,
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
    if (image_type !== 'COVER') {
      // Ignore any changes to non-cover image relations
      return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_SEASON_TYPE,
      season_id,
      {}, // Localizable fields are never updated on image assignment
      undefined, // Title is never updated on image assignment
      image_id,
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
    loginClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    if (
      image_type !== 'COVER' ||
      (await this.seasonIsDeleted(season_id, loginClient))
    ) {
      // Ignore any changes to non-cover image relations
      // If image relation is deleted as part of a cascade delete of season - no need to upsert
      return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_SEASON_TYPE,
      season_id,
      {}, // Localizable fields are never updated on image unassign
      undefined, // Title is never updated on image unassign
      null, // Explicit unassign of an image
    );
  }

  async seasonIsDeleted(
    seasonId: number,
    loginClient: ClientBase,
  ): Promise<boolean> {
    const data = await selectOne(
      'seasons',
      { id: seasonId },
      { columns: ['id'] },
    ).run(loginClient);
    return !data;
  }
}
