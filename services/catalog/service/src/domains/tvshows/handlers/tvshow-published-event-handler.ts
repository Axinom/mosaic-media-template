import { isNullOrWhitespace, Logger } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
  UNKNOWN_AGGREGATE_ID,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CatalogServiceMessagingSettings,
  EntityPublishSuccessEvent,
  PublishServiceMessagingSettings,
  TvshowPublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import { deletes, insert } from 'zapatos/db';
import {
  tvshow_images,
  tvshow_licenses,
  tvshow_localizations,
  tvshow_video_cue_points,
  tvshow_video_streams,
} from 'zapatos/schema';
import { Config, syncInMemoryLocales } from '../../../common';
import { requestServiceAccountToken } from '../../../common/utils/token-utils';

export class TvshowPublishedEventHandler extends TransactionalInboxMessageHandler<
  TvshowPublishedEvent,
  Config
> {
  constructor(
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config
  ) {
    super(
      PublishServiceMessagingSettings.TvshowPublished,
      new Logger({
        config,
        context: TvshowPublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<TvshowPublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await deletes('tvshow', { id: payload.content_id }).run(txnClient);

    const insertedTvshow = await insert('tvshow', {
      id: payload.content_id,
      original_title: payload.original_title,
      released: payload.released,
      tags: payload.tags,
      tvshow_cast: payload.cast,
      studio: payload.studio,
      production_countries: payload.production_countries,
      audio_languages: payload.audio_languages,
      caption_languages: payload.caption_languages,
      subtitle_languages: payload.subtitle_languages,
      directors: payload.directors,
      business_type: payload.business_type,
      dynamic_field: payload.dynamic_field,
      extended_field: payload.extended_field,
      rating: payload.rating,
      custom_rating: payload.custom_rating,
      age_rating: payload.age_rating,
      asset_type: payload.asset_type,
      asset_subtype: payload.asset_subtype,
    }).run(txnClient);

    if (payload.videos) {
      for (const video of payload.videos) {
        const { video_streams, cue_points, ...videoToInsert } = video;

        const tvshowVideo = await insert('tvshow_videos', {
          tvshow_id: insertedTvshow.id,
          ...videoToInsert,
        }).run(txnClient);
        if (video_streams !== undefined) {
          await insert(
            'tvshow_video_streams',
            video_streams.map(
              (videoStream): tvshow_video_streams.Insertable => ({
                tvshow_video_id: tvshowVideo.id,
                ...videoStream,
              }),
            ),
          ).run(txnClient);
        }

        if (cue_points !== undefined) {
          await insert(
            'tvshow_video_cue_points',
            cue_points.map(
              (cuePoint): tvshow_video_cue_points.Insertable => ({
                tvshow_video_id: tvshowVideo.id,
                ...cuePoint,
              }),
            ),
          ).run(txnClient);
        }
      }
    }

    if (payload.images) {
      await insert(
        'tvshow_images',
        payload.images.map(
          (image): tvshow_images.Insertable => ({
            tvshow_id: insertedTvshow.id,
            ...image,
          }),
        ),
      ).run(txnClient);
    }

    await insert(
      'tvshow_licenses',
      payload.licenses.map(
        (license): tvshow_licenses.Insertable => ({
          tvshow_id: insertedTvshow.id,
          ...license,
        }),
      ),
    ).run(txnClient);

    if (payload.genre_ids) {
      await insert(
        'tvshow_genres_relation',
        payload.genre_ids.map((genreId, i) => ({
          tvshow_id: insertedTvshow.id,
          tvshow_genre_id: genreId,
          order_no: i,
        })),
      ).run(txnClient);
    }

    if (payload.localizations) {
      await syncInMemoryLocales(payload.localizations, txnClient);
      await insert(
        'tvshow_localizations',
        payload.localizations.map(
          (l): tvshow_localizations.Insertable => ({
            tvshow_id: payload.content_id,
            is_default_locale: l.is_default_locale,
            locale: l.language_tag,
            title: l.title,
            synopsis: l.synopsis,
            description: l.description,
          }),
        ),
      ).run(txnClient);

      await insert(
        'tvshow_images',
        payload.localizations
          .filter((l) => !isNullOrWhitespace(l.cover) && !l.is_default_locale)
          .map(
            (l): tvshow_images.Insertable => ({
              tvshow_id: payload.content_id,
              language_tag: l.language_tag,
              path: l.cover,
              type: 'COVER',
            }),
          ),
      ).run(txnClient);
      await insert(
        'tvshow_images',
        payload.localizations
          .filter(
            (l) => !isNullOrWhitespace(l.clean_cover) && !l.is_default_locale,
          )
          .map(
            (l): tvshow_images.Insertable => ({
              tvshow_id: payload.content_id,
              language_tag: l.language_tag,
              path: l.clean_cover,
              type: 'CLEAN_COVER',
            }),
          ),
      ).run(txnClient);
      await insert(
        'tvshow_images',
        payload.localizations
          .filter((l) => !isNullOrWhitespace(l.list) && !l.is_default_locale)
          .map(
            (l): tvshow_images.Insertable => ({
              tvshow_id: payload.content_id,
              language_tag: l.language_tag,
              path: l.list,
              type: 'TEASER',
            }),
          ),
      ).run(txnClient);
    }

    const accessToken = await requestServiceAccountToken(this.config);
        await this.storeOutboxMessage<EntityPublishSuccessEvent>(
          payload.content_id ? payload.content_id : UNKNOWN_AGGREGATE_ID,
          CatalogServiceMessagingSettings.EntityPublishSuccess,
          {
            content_id: payload.content_id,
          },
          txnClient,
          { envelopeOverrides: { auth_token: accessToken } },
        );
  }
}
