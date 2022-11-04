import {
  PublishServiceMessagingSettings,
  TvshowPublishedEvent,
  TvshowPublishedEventSchema,
} from 'media-messages';
import * as yup from 'yup';
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

const tvshowDataAggregator: SnapshotDataAggregator = async (
  entityId: number,
  authToken: string,
  config: Config,
  queryable: Queryable,
) => {
  const tvshow = await selectExactlyOne(
    'tvshows',
    { id: entityId },
    {
      lateral: {
        images: select('tvshows_images', {
          tvshow_id: parent('id'),
        }),
        cast: select('tvshows_casts', { tvshow_id: parent('id') }),
        tags: select('tvshows_tags', { tvshow_id: parent('id') }),
        licenses: select(
          'tvshows_licenses',
          { tvshow_id: parent('id') },
          {
            lateral: {
              countries: select('tvshows_licenses_countries', {
                tvshows_license_id: parent('id'),
              }),
            },
          },
        ),
        trailers: select('tvshows_trailers', {
          tvshow_id: parent('id'),
        }),
        genres: select('tvshows_tvshow_genres', {
          tvshow_id: parent('id'),
        }),
        productionCountries: select('tvshows_production_countries', {
          tvshow_id: parent('id'),
        }),
      },
    },
  ).run(queryable);

  const { result: videos, validation: videosValidation } =
    await getVideosMetadata(
      config.encodingServiceBaseUrl,
      authToken,
      null,
      tvshow.trailers,
    );

  const { result: images, validation: imagesValidation } =
    await getImagesMetadata(
      config.imageServiceBaseUrl,
      authToken,
      tvshow.images,
    );

  const snapshotJson: TvshowPublishedEvent = {
    content_id: buildPublishingId('tvshows', tvshow.id),
    title: tvshow.title,
    synopsis: tvshow.synopsis ?? undefined,
    description: tvshow.description ?? undefined,
    original_title: tvshow.original_title ?? undefined,
    released: tvshow.released ?? undefined,
    studio: tvshow.studio ?? undefined,
    production_countries: tvshow.productionCountries.map((c) => c.name),
    genre_ids: tvshow.genres.map((g) =>
      buildPublishingId('tvshow_genres', g.tvshow_genres_id),
    ),
    cast: tvshow.cast.map((c) => c.name),
    tags: tvshow.tags.map((c) => c.name),
    licenses: tvshow.licenses.map((license) => ({
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

const customTvshowValidation = async (
  json: unknown,
): Promise<SnapshotValidationResult[]> => {
  const yupSchema = yup.object({
    genre_ids: atLeastOneString,
    images: requiredCover,
    videos: videosValidation('TRAILER'),
    licenses: licensesValidation(false),
  });
  return validateYupPublishSchema(json, yupSchema);
};

export const publishingTvshowProcessor: EntityPublishingProcessor = {
  type: 'tvshows',
  aggregator: tvshowDataAggregator,
  validator: customTvshowValidation,
  validationSchema: TvshowPublishedEventSchema,
  publishMessagingSettings: PublishServiceMessagingSettings.TvshowPublished,
  unpublishMessagingSettings: PublishServiceMessagingSettings.TvshowUnpublished,
};
