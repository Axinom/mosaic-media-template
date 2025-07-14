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
  EpisodePublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { deletes, insert } from 'zapatos/db';
import {
  episode_images,
  episode_licenses,
  episode_localizations,
  episode_video_cue_points,
  episode_video_streams,
} from 'zapatos/schema';
import { Config, syncInMemoryLocales } from '../../../common';
import { requestServiceAccountToken } from '../../../common/utils/token-utils';

export class EpisodePublishedEventHandler extends TransactionalInboxMessageHandler<
  EpisodePublishedEvent,
  Config
> {
  constructor(
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config
  ) {
    super(
      PublishServiceMessagingSettings.EpisodePublished,
      new Logger({
        config,
        context: EpisodePublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<EpisodePublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await deletes('episode', { id: payload.content_id }).run(txnClient);

    const insertedEpisode = await insert('episode', {
      id: payload.content_id,
      season_id: payload.season_id,
      index: payload.index,
      original_title: payload.original_title,
      released: payload.released,
      tags: payload.tags,
      episode_cast: payload.cast,
      studio: payload.studio,
      production_countries: payload.production_countries,
      directors: payload.directors,
      credits_start_time: payload.credits_start_time,
      length_in_seconds: payload.length_in_seconds,
      dynamic_field: payload.dynamic_field,
      extended_field: payload.extended_field,
      rating: payload.rating,
      custom_rating: payload.custom_rating,
      age_rating: payload.age_rating,
      asset_type: payload.asset_type,
      asset_subtype: payload.asset_subtype,
      intro_start_time: payload.intro_start_time,
      intro_end_time: payload.intro_end_time,
      tvshow_id: payload.tvshow_id,
    }).run(txnClient);

    if (payload.videos) {
      for (const video of payload.videos) {
        const { video_streams, cue_points, ...videoToInsert } = video;

        const episodeVideo = await insert('episode_videos', {
          episode_id: insertedEpisode.id,
          ...videoToInsert,
        }).run(txnClient);
        if (video_streams !== undefined) {
          await insert(
            'episode_video_streams',
            video_streams.map(
              (videoStream): episode_video_streams.Insertable => ({
                episode_video_id: episodeVideo.id,
                ...videoStream,
              }),
            ),
          ).run(txnClient);
        }

        if (cue_points !== undefined) {
          await insert(
            'episode_video_cue_points',
            cue_points.map(
              (cuePoint): episode_video_cue_points.Insertable => ({
                episode_video_id: episodeVideo.id,
                ...cuePoint,
              }),
            ),
          ).run(txnClient);
        }
      }
    }

    if (payload.images) {
      await insert(
        'episode_images',
        payload.images.map(
          (image): episode_images.Insertable => ({
            episode_id: insertedEpisode.id,
            ...image,
          }),
        ),
      ).run(txnClient);
    }

    await insert(
      'episode_licenses',
      payload.licenses.map(
        (license): episode_licenses.Insertable => ({
          episode_id: insertedEpisode.id,
          ...license,
        }),
      ),
    ).run(txnClient);

    if (payload.genre_ids) {
      await insert(
        'episode_genres_relation',
        payload.genre_ids.map((genreId, i) => ({
          episode_id: insertedEpisode.id,
          tvshow_genre_id: genreId,
          order_no: i,
        })),
      ).run(txnClient);
    }

    if (payload.localizations) {
      await syncInMemoryLocales(payload.localizations, txnClient);
      await insert(
        'episode_localizations',
        payload.localizations.map(
          (l): episode_localizations.Insertable => ({
            episode_id: payload.content_id,
            is_default_locale: l.is_default_locale,
            locale: l.language_tag,
            title: l.title,
            synopsis: l.synopsis,
            description: l.description,
          }),
        ),
      ).run(txnClient);

      await insert(
        'episode_images',
        payload.localizations
          .filter((l) => !isNullOrWhitespace(l.cover) && !l.is_default_locale)
          .map(
            (l): episode_images.Insertable => ({
              episode_id: payload.content_id,
              language_tag: l.language_tag,
              path: l.cover,
              type: 'COVER',
            }),
          ),
      ).run(txnClient);
      await insert(
        'episode_images',
        payload.localizations
          .filter(
            (l) => !isNullOrWhitespace(l.clean_cover) && !l.is_default_locale,
          )
          .map(
            (l): episode_images.Insertable => ({
              episode_id: payload.content_id,
              language_tag: l.language_tag,
              path: l.clean_cover,
              type: 'CLEAN_COVER',
            }),
          ),
      ).run(txnClient);
      await insert(
        'episode_images',
        payload.localizations
          .filter((l) => !isNullOrWhitespace(l.list) && !l.is_default_locale)
          .map(
            (l): episode_images.Insertable => ({
              episode_id: payload.content_id,
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
