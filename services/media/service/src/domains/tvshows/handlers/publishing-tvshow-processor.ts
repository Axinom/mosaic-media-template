import { MosaicError } from '@axinom/mosaic-service-common';
import {
  PublishServiceMessagingSettings,
  TvshowPublishedEvent,
  TvshowPublishedEventSchema,
} from 'media-messages';
import { parent, Queryable, select, selectExactlyOne } from 'zapatos/db';
import { CommonErrors, Config, DEFAULT_LOCALE_TAG } from '../../../common';
import {
  buildPublishingId,
  EntityPublishingProcessor,
  SnapshotDataAggregator,
} from '../../../publishing';
import { getImagesMetadata, getVideosMetadata } from '../../common';
import {
  getTvshowLocalizationsMetadata,
  getTvShowLocalizedImagesMetadata,
} from '../localization';

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
        directors: select('tvshows_directors', { tvshow_id: parent('id') }),
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

  const [
    { result: videos, validation: videosValidation },
    { result: images, validation: imagesValidation },
    { result: localizations, validation: localizationsValidation },
  ] = await Promise.all([
    getVideosMetadata(
      config.videoServiceBaseUrl,
      authToken,
      null,
      tvshow.trailers,
    ),
    getImagesMetadata(config.imageServiceBaseUrl, authToken, tvshow.images),
    getTvshowLocalizationsMetadata(config, authToken, tvshow.id.toString()),
  ]);

  const imageLocalizations = await getTvShowLocalizedImagesMetadata(
    tvshow.id,
    localizations,
    config.imageServiceBaseUrl,
    authToken,
  );

  const tvshowImages = images;
  const tvshowImageValidations = imagesValidation;
  imageLocalizations.forEach((localization) => {
    tvshowImages.push(
      ...localization.result.map((image) => {
        return {
          ...image,
          language_tag: localization.language_tag,
        };
      }),
    );
    tvshowImageValidations.push(
      ...localization.validation.map((validation) => {
        return {
          ...validation,
          language_tag: localization.language_tag,
        };
      }),
    );
  });

  if (tvshow.publishing_id === undefined || tvshow.publishing_id === null) {
    throw new MosaicError({
      ...CommonErrors.EntityPublishingIdNotFound,
      messageParams: ['TVShow', entityId],
    });
  }

  const snapshotJson: TvshowPublishedEvent = {
    content_id: tvshow.publishing_id,
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
      countries: license.countries.map((country) => country.country_code ?? ''),
    })),
    images: tvshowImages,
    videos,
    directors: tvshow.directors.map((d) => d.name),
    business_type: tvshow.business_type ?? undefined,
    extended_field: tvshow.extended_field ?? undefined,
    rating: tvshow.rating ?? undefined,
    age_rating: tvshow.age_rating ?? undefined,
    asset_type: 6,
    asset_subtype: 'TVShow',
    localizations: localizations ?? [
      {
        is_default_locale: true,
        language_tag: DEFAULT_LOCALE_TAG,
        title: tvshow.title,
        synopsis: tvshow.synopsis ?? undefined,
        description: tvshow.description ?? undefined,
      },
    ],
  };

  return {
    result: snapshotJson,
    validation: [
      ...tvshowImageValidations,
      ...videosValidation,
      ...localizationsValidation,
    ],
  };
};

export const publishingTvshowProcessor: EntityPublishingProcessor = {
  type: 'tvshows',
  aggregator: tvshowDataAggregator,
  validationSchema: TvshowPublishedEventSchema,
  publishMessagingSettings: PublishServiceMessagingSettings.TvshowPublished,
  unpublishMessagingSettings: PublishServiceMessagingSettings.TvshowUnpublished,
};
