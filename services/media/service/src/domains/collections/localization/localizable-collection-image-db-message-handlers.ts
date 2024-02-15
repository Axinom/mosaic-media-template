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
import { LOCALIZATION_COLLECTION_TYPE } from './constants';
import { LocalizableCollectionDbMessagingSettings } from './localizable-collection-db-messaging-settings';

export interface LocalizableCollectionImageDbEvent {
  collection_id: number;
  image_id: string;
  image_type: string;
}

export class LocalizableCollectionImageCreatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableCollectionImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableCollectionDbMessagingSettings.LocalizableCollectionImageCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { image_type, collection_id, image_id },
  }: TransactionalInboxMessage<LocalizableCollectionImageDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    if (image_type !== 'COVER') {
      // Ignore any changes to non-cover image relations
      return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_COLLECTION_TYPE,
      collection_id,
      {}, // Localizable fields are never updated on image assignment
      undefined, // Title is never updated on image assignment
      image_id,
    );
  }
}

export class LocalizableCollectionImageUpdatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableCollectionImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableCollectionDbMessagingSettings.LocalizableCollectionImageUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { image_type, collection_id, image_id },
  }: TransactionalInboxMessage<LocalizableCollectionImageDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    if (image_type !== 'COVER') {
      // Ignore any changes to non-cover image relations
      return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_COLLECTION_TYPE,
      collection_id,
      {}, // Localizable fields are never updated on image assignment
      undefined, // Title is never updated on image assignment
      image_id,
    );
  }
}

export class LocalizableCollectionImageDeletedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableCollectionImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableCollectionDbMessagingSettings.LocalizableCollectionImageDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData(
    {
      payload: { image_type, collection_id },
    }: TransactionalInboxMessage<LocalizableCollectionImageDbEvent>,
    loginClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    if (
      image_type !== 'COVER' ||
      (await this.collectionIsDeleted(collection_id, loginClient))
    ) {
      // Ignore any changes to non-cover image relations
      // If image relation is deleted as part of a cascade delete of collection - no need to upsert
      return undefined;
    }

    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_COLLECTION_TYPE,
      collection_id,
      {}, // Localizable fields are never updated on image unassign
      undefined, // Title is never updated on image unassign
      null, // Explicit unassign of an image
    );
  }

  async collectionIsDeleted(
    collectionId: number,
    loginClient: ClientBase,
  ): Promise<boolean> {
    const data = await selectOne(
      'collections',
      { id: collectionId },
      { columns: ['id'] },
    ).run(loginClient);
    return !data;
  }
}
