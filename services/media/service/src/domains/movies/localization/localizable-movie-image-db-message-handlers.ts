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
import { LOCALIZATION_MOVIE_TYPE } from './constants';
import { LocalizableMovieDbMessagingSettings } from './localizable-movie-db-messaging-settings';

export interface LocalizableMovieImageDbEvent {
  movie_id: number;
  image_id: string;
  image_type: string;
}

export class LocalizableMovieImageCreatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableMovieImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableMovieDbMessagingSettings.LocalizableMovieImageCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { image_type, movie_id, image_id },
  }: TypedTransactionalMessage<LocalizableMovieImageDbEvent>): Promise<
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
      LOCALIZATION_MOVIE_TYPE,
      movie_id,
      fields, // localizable image id fields
      undefined, // Title is never updated on image assignment
      image_id,
    );
  }
}

export class LocalizableMovieImageUpdatedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableMovieImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableMovieDbMessagingSettings.LocalizableMovieImageUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { image_type, movie_id, image_id },
  }: TypedTransactionalMessage<LocalizableMovieImageDbEvent>): Promise<
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
      LOCALIZATION_MOVIE_TYPE,
      movie_id,
      fields, // localizable image id fields
      undefined, // Title is never updated on image assignment
      image_id,
    );
  }
}

export class LocalizableMovieImageDeletedDbMessageHandler extends LocalizableMediaTransactionalInboxMessageHandler<LocalizableMovieImageDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableMovieDbMessagingSettings.LocalizableMovieImageDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData(
    {
      payload: { image_type, movie_id },
    }: TypedTransactionalMessage<LocalizableMovieImageDbEvent>,
    ownerClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    if (await this.movieIsDeleted(movie_id, ownerClient)) {
      // If image relation is deleted as part of a cascade delete of movie - no need to upsert
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
        LOCALIZATION_MOVIE_TYPE,
        movie_id,
        fields, // Localizable fields are never updated on image unassign
        undefined, // Title is never updated on image unassign
        null, // Explicit unassign of an image
      );
    }
  }

  async movieIsDeleted(
    movieId: number,
    ownerClient: ClientBase,
  ): Promise<boolean> {
    const data = await selectOne(
      'movies',
      { id: movieId },
      { columns: ['id'] },
    ).run(ownerClient);
    return !data;
  }
}
