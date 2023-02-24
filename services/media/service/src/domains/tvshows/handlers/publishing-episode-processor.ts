import {
  EpisodePublishedEvent,
  EpisodePublishedEventSchema,
  PublishServiceMessagingSettings,
} from 'media-messages';
import * as Yup from 'yup';
import { parent, Queryable, select, selectExactlyOne } from 'zapatos/db';
import { Config } from '../../../common';
import {
  atLeastOneString,
  buildPublishingId,
  EntityPublishingProcessor,
  licensesValidation,
  requiredCover,
  SnapshotDataAggregator,
  SnapshotValidationResult,
  validateYupPublishSchema,
  videosValidation,
} from '../../../publishing';
import { getImagesMetadata, getVideosMetadata } from '../../common';

const episodeDataAggregator: SnapshotDataAggregator = async (
  entityId: number,
  authToken: string,
  config: Config,
  queryable: Queryable,
) => {
  const episode = await selectExactlyOne(
    'episodes',
    { id: entityId },
    {
      lateral: {
        images: select('episodes_images', {
          episode_id: parent('id'),
        }),
        cast: select('episodes_casts', { episode_id: parent('id') }),
        tags: select('episodes_tags', { episode_id: parent('id') }),
        licenses: select(
          'episodes_licenses',
          { episode_id: parent('id') },
          {
            lateral: {
              countries: select('episodes_licenses_countries', {
                episodes_license_id: parent('id'),
              }),
            },
          },
        ),
        trailers: select('episodes_trailers', {
          episode_id: parent('id'),
        }),
        genres: select('episodes_tvshow_genres', {
          episode_id: parent('id'),
        }),
        productionCountries: select('episodes_production_countries', {
          episode_id: parent('id'),
        }),
      },
    },
  ).run(queryable);

  const { result: videos, validation: videosValidation } =
    await getVideosMetadata(
      config.encodingServiceBaseUrl,
      authToken,
      episode.main_video_id,
      episode.trailers,
    );

  const { result: images, validation: imagesValidation } =
    await getImagesMetadata(
      config.imageServiceBaseUrl,
      authToken,
      episode.images,
    );

  const snapshotJson: EpisodePublishedEvent = {
    content_id: buildPublishingId('episodes', episode.id),
    season_id: episode.season_id
      ? buildPublishingId('seasons', episode.season_id)
      : undefined,
    index: episode.index,
    title: episode.title,
    synopsis: episode.synopsis ?? undefined,
    description: episode.description ?? undefined,
    original_title: episode.original_title ?? undefined,
    released: episode.released ?? undefined,
    studio: episode.studio ?? undefined,
    production_countries: episode.productionCountries.map((c) => c.name),
    genre_ids: episode.genres.map((g) =>
      buildPublishingId('tvshow_genres', g.tvshow_genres_id),
    ),
    cast: episode.cast.map((c) => c.name),
    tags: episode.tags.map((c) => c.name),
    licenses: episode.licenses.map((license) => ({
      start_time: license.license_start ?? undefined,
      end_time: license.license_end ?? undefined,
      countries: license.countries.map((country) => country.code),
    })),
    images,
    videos,
  };

  return {
    result: snapshotJson,
    validation: [...imagesValidation, ...videosValidation],
  };
};

const customEpisodeValidation = async (
  json: unknown,
): Promise<SnapshotValidationResult[]> => {
  const yupSchema = Yup.object({
    genre_ids: atLeastOneString,
    images: requiredCover,
    videos: videosValidation('MAIN', 'TRAILER'),
    licenses: licensesValidation(false),
  });
  return validateYupPublishSchema(json, yupSchema);
};

export const publishingEpisodeProcessor: EntityPublishingProcessor = {
  type: 'episodes',
  aggregator: episodeDataAggregator,
  validator: customEpisodeValidation,
  validationSchema: EpisodePublishedEventSchema,
  publishMessagingSettings: PublishServiceMessagingSettings.EpisodePublished,
  unpublishMessagingSettings:
    PublishServiceMessagingSettings.EpisodeUnpublished,
};
