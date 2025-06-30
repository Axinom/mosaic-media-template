import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { conditions as c, select, selectOne } from 'zapatos/db';
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

  override async getLocalizationCommandData(
    {
      payload: { image_type, collection_id, image_id },
    }: TypedTransactionalMessage<LocalizableCollectionImageDbEvent>,
    ownerClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    let fields = {};
    switch (image_type) {
      case 'COLLECTION_COVER':
        fields = { collection_cover: image_id };
        break;
      case 'COLLECTION_COVER_1x1':
        fields = { collection_cover_1x1: image_id };
        break;
      case 'COLLECTION_COVER_4x1':
        fields = { collection_cover_4x1: image_id };
        break;
      case 'COLLECTION_CLEAN_COVER':
        fields = { collection_clean_cover: image_id };
        break;
      case 'COLLECTION_CLEAN_COVER_1x1':
        fields = { collection_clean_cover_1x1: image_id };
        break;
      case 'COLLECTION_CLEAN_COVER_4x1':
        fields = { collection_clean_cover_4x1: image_id };
        break;
      case 'COLLECTION_LIST':
        fields = { collection_list: image_id };
        break;
      case 'COLLECTION_LIST_1x1':
        fields = { collection_list_1x1: image_id };
        break;
      case 'COLLECTION_LIST_15x16':
        fields = { collection_list_15x16: image_id };
        break;
      default:
        return undefined;
    }
    const coverImageId = await applyCoverImageFallback(
      collection_id,
      ownerClient,
    );
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_COLLECTION_TYPE,
      collection_id,
      fields, // localizable image id fields
      undefined, // Title is never updated on image assignment
      coverImageId,
      `${collection_id}-${image_type}`,
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

  override async getLocalizationCommandData(
    {
      payload: { image_type, collection_id, image_id },
    }: TypedTransactionalMessage<LocalizableCollectionImageDbEvent>,
    ownerClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    let fields = {};
    switch (image_type) {
      case 'COLLECTION_COVER':
        fields = { collection_cover: image_id };
        break;
      case 'COLLECTION_COVER_1x1':
        fields = { collection_cover_1x1: image_id };
        break;
      case 'COLLECTION_COVER_4x1':
        fields = { collection_cover_4x1: image_id };
        break;
      case 'COLLECTION_CLEAN_COVER':
        fields = { collection_clean_cover: image_id };
        break;
      case 'COLLECTION_CLEAN_COVER_1x1':
        fields = { collection_clean_cover_1x1: image_id };
        break;
      case 'COLLECTION_CLEAN_COVER_4x1':
        fields = { collection_clean_cover_4x1: image_id };
        break;
      case 'COLLECTION_LIST':
        fields = { collection_list: image_id };
        break;
      case 'COLLECTION_LIST_1x1':
        fields = { collection_list_1x1: image_id };
        break;
      case 'COLLECTION_LIST_15x16':
        fields = { collection_list_15x16: image_id };
        break;
      default:
        return undefined;
    }
    const coverImageId = await applyCoverImageFallback(
      collection_id,
      ownerClient,
    );
    return getUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_COLLECTION_TYPE,
      collection_id,
      fields, // localizable image id fields
      undefined, // Title is never updated on image assignment
      coverImageId,
      `${collection_id}-${image_type}`,
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
    }: TypedTransactionalMessage<LocalizableCollectionImageDbEvent>,
    ownerClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    if (await this.collectionIsDeleted(collection_id, ownerClient)) {
      // If image relation is deleted as part of a cascade delete of tvshow - no need to upsert
      return undefined;
    } else {
      let fields = {};
      switch (image_type) {
        case 'COLLECTION_COVER':
          fields = { collection_cover: '' };
          break;
        case 'COLLECTION_COVER_1x1':
          fields = { collection_cover_1x1: '' };
          break;
        case 'COLLECTION_COVER_4x1':
          fields = { collection_cover_4x1: '' };
          break;
        case 'COLLECTION_CLEAN_COVER':
          fields = { collection_clean_cover: '' };
          break;
        case 'COLLECTION_CLEAN_COVER_1x1':
          fields = { collection_clean_cover_1x1: '' };
          break;
        case 'COLLECTION_CLEAN_COVER_4x1':
          fields = { collection_clean_cover_4x1: '' };
          break;
        case 'COLLECTION_LIST':
          fields = { collection_list: '' };
          break;
        case 'COLLECTION_LIST_1x1':
          fields = { collection_list_1x1: '' };
          break;
        case 'COLLECTION_LIST_15x16':
          fields = { collection_list_15x16: '' };
          break;
        default:
          return undefined;
      }
      const coverImageId = await applyCoverImageFallback(
        collection_id,
        ownerClient,
      );
      return getUpsertMessageData(
        this.config.serviceId,
        LOCALIZATION_COLLECTION_TYPE,
        collection_id,
        fields, // localizable image id fields
        undefined, // Title is never updated on image unassign
        coverImageId,
        `${collection_id}-${image_type}`,
      );
    }
  }

  async collectionIsDeleted(
    collectionId: number,
    ownerClient: ClientBase,
  ): Promise<boolean> {
    const data = await selectOne(
      'collections',
      { id: collectionId },
      { columns: ['id'] },
    ).run(ownerClient);
    return !data;
  }
}

async function applyCoverImageFallback(
  collectionId: number,
  ownerClient: ClientBase,
): Promise<string | undefined> {
  const collectionImages = await select('collections_images', {
    collection_id: collectionId,
    image_type: c.isIn([
      'COLLECTION_COVER',
      'COLLECTION_COVER_1x1',
      'COLLECTION_COVER_4x1',
    ]),
  }).run(ownerClient);

  const priorityOrder = [
    'COLLECTION_COVER',
    'COLLECTION_COVER_1x1',
    'COLLECTION_COVER_4x1',
  ] as const;

  const collectionCoverImageId = priorityOrder
    .map((imageType) =>
      collectionImages.find((img) => img.image_type === imageType),
    )
    .find((image) => image !== undefined)?.image_id;
  return collectionCoverImageId;
}
