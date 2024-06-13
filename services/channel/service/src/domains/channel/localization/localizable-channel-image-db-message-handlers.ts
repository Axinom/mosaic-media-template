import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { selectOne } from 'zapatos/db';
import { Config, LOCALIZATION_CHANNEL_TYPE } from '../../../common';
import {
  getLocalizationUpsertMessageData,
  LocalizableTransactionalInboxMessageHandler,
  LocalizationMessageData,
} from '../../../localization';
import { LocalizableChannelDbMessagingSettings } from './localizable-channel-db-messaging-settings';

export interface LocalizableChannelImageDbEvent {
  channel_id: string;
  image_id: string;
  image_type: string;
}

export class LocalizableChannelImageCreatedDbMessageHandler extends LocalizableTransactionalInboxMessageHandler<LocalizableChannelImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableChannelDbMessagingSettings.LocalizableChannelImageCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { image_type, channel_id, image_id },
  }: TypedTransactionalMessage<LocalizableChannelImageDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    if (image_type !== 'LOGO') {
      // Ignore any changes to non-logo image relations
      return undefined;
    }

    return getLocalizationUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_CHANNEL_TYPE,
      channel_id,
      {}, // Localizable fields are never updated on image assignment
      undefined, // Title is never updated on image assignment
      image_id,
    );
  }
}

export class LocalizableChannelImageUpdatedDbMessageHandler extends LocalizableTransactionalInboxMessageHandler<LocalizableChannelImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableChannelDbMessagingSettings.LocalizableChannelImageUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { image_type, channel_id, image_id },
  }: TypedTransactionalMessage<LocalizableChannelImageDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    if (image_type !== 'LOGO') {
      // Ignore any changes to non-logo image relations
      return undefined;
    }

    return getLocalizationUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_CHANNEL_TYPE,
      channel_id,
      {}, // Localizable fields are never updated on image assignment
      undefined, // Title is never updated on image assignment
      image_id,
    );
  }
}

export class LocalizableChannelImageDeletedDbMessageHandler extends LocalizableTransactionalInboxMessageHandler<LocalizableChannelImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableChannelDbMessagingSettings.LocalizableChannelImageDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData(
    {
      payload: { image_type, channel_id },
    }: TypedTransactionalMessage<LocalizableChannelImageDbEvent>,
    ownerClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    if (
      image_type !== 'LOGO' ||
      (await this.channelIsDeleted(channel_id, ownerClient))
    ) {
      // Ignore any changes to non-logo image relations
      // If image relation is deleted as part of a cascade delete of channel - no need to upsert
      return undefined;
    }

    return getLocalizationUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_CHANNEL_TYPE,
      channel_id,
      {}, // Localizable fields are never updated on image unassign
      undefined, // Title is never updated on image unassign
      null, // Explicit unassign of an image
    );
  }

  async channelIsDeleted(
    channelId: string,
    ownerClient: ClientBase,
  ): Promise<boolean> {
    const data = await selectOne(
      'channels',
      { id: channelId },
      { columns: ['id'] },
    ).run(ownerClient);
    return !data;
  }
}
