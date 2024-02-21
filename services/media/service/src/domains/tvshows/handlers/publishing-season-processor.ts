import {
  PublishServiceMessagingSettings,
  SeasonPublishedEvent,
  SeasonPublishedEventSchema,
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

const seasonDataAggregator: SnapshotDataAggregator = async (
  entityId: number,
  authToken: string,
  config: Config,
  queryable: Queryable,
) => {
  const season = await selectExactlyOne(
    'seasons',
    { id: entityId },
    {
      lateral: {
        images: select('seasons_images', {
          season_id: parent('id'),
        }),
        cast: select('seasons_casts', { season_id: parent('id') }),
        tags: select('seasons_tags', { season_id: parent('id') }),
        licenses: select(
          'seasons_licenses',
          { season_id: parent('id') },
          {
            lateral: {
              countries: select('seasons_licenses_countries', {
                seasons_license_id: parent('id'),
              }),
            },
          },
        ),
        trailers: select('seasons_trailers', {
          season_id: parent('id'),
        }),
        genres: select('seasons_tvshow_genres', {
          season_id: parent('id'),
        }),
        productionCountries: select('seasons_production_countries', {
          season_id: parent('id'),
        }),
      },
    },
  ).run(queryable);

  const { result: videos, validation: videosValidation } =
    await getVideosMetadata(
      config.videoServiceBaseUrl,
      authToken,
      null,
      season.trailers,
    );

  const { result: images, validation: imagesValidation } =
    await getImagesMetadata(
      config.imageServiceBaseUrl,
      authToken,
      season.images,
    );

  const snapshotJson: SeasonPublishedEvent = {
    content_id: buildPublishingId('seasons', season.id),
    tvshow_id: season.tvshow_id
      ? buildPublishingId('tvshows', season.tvshow_id)
      : undefined,
    index: season.index,
    synopsis: season.synopsis ?? undefined,
    description: season.description ?? undefined,
    released: season.released ?? undefined,
    studio: season.studio ?? undefined,
    production_countries: season.productionCountries.map((c) => c.name),
    genre_ids: season.genres.map((g) =>
      buildPublishingId('tvshow_genres', g.tvshow_genres_id),
    ),
    cast: season.cast.map((c) => c.name),
    tags: season.tags.map((c) => c.name),
    licenses: season.licenses.map((license) => ({
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

const customSeasonValidation = async (
  json: unknown,
): Promise<SnapshotValidationResult[]> => {
  const yupSchema = Yup.object({
    genre_ids: atLeastOneString,
    images: requiredCover,
    videos: videosValidation('TRAILER'),
    licenses: licensesValidation(false),
  });
  return validateYupPublishSchema(json, yupSchema);
};

export const publishingSeasonProcessor: EntityPublishingProcessor = {
  type: 'seasons',
  aggregator: seasonDataAggregator,
  validator: customSeasonValidation,
  validationSchema: SeasonPublishedEventSchema,
  publishMessagingSettings: PublishServiceMessagingSettings.SeasonPublished,
  unpublishMessagingSettings: PublishServiceMessagingSettings.SeasonUnpublished,
};
