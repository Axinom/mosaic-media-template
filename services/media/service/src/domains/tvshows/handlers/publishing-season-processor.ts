import { MosaicError } from '@axinom/mosaic-service-common';
import {
  PublishServiceMessagingSettings,
  SeasonPublishedEvent,
  SeasonPublishedEventSchema,
} from 'media-messages';
import {
  parent,
  Queryable,
  select,
  selectExactlyOne,
  selectOne,
} from 'zapatos/db';
import { CommonErrors, Config, DEFAULT_LOCALE_TAG } from '../../../common';
import {
  buildBDPublishingId,
  buildPublishingId,
  EntityPublishingProcessor,
  SnapshotDataAggregator,
} from '../../../publishing';
import { getImagesMetadata, getVideosMetadata } from '../../common';
import {
  getSeasonLocalizationsMetadata,
  getSeasonLocalizedImagesMetadata,
} from '../localization';

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
        directors: select('seasons_directors', { season_id: parent('id') }),
        trailers: select('seasons_trailers', {
          season_id: parent('id'),
        }),
        genres: select('seasons_tvshow_genres', {
          season_id: parent('id'),
        }),
        productionCountries: select('seasons_production_countries', {
          season_id: parent('id'),
        }),
        tvshow: selectOne('tvshows', {
          id: parent('tvshow_id'),
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
      season.trailers,
    ),
    getImagesMetadata(config.imageServiceBaseUrl, authToken, season.images),
    getSeasonLocalizationsMetadata(config, authToken, season.id.toString()),
  ]);

  const imageLocalizations = await getSeasonLocalizedImagesMetadata(
    season.id,
    localizations,
    config.imageServiceBaseUrl,
    authToken,
  );

  const seasonImages = images;
  const seasonImageValidations = imagesValidation;
  imageLocalizations.forEach((localization) => {
    seasonImages.push(
      ...localization.result.map((image) => {
        return {
          ...image,
          language_tag: localization.language_tag,
        };
      }),
    );
    seasonImageValidations.push(
      ...localization.validation.map((validation) => {
        return {
          ...validation,
          language_tag: localization.language_tag,
        };
      }),
    );
  });

  if (season.publishing_id === undefined || season.publishing_id === null) {
    throw new MosaicError({
      ...CommonErrors.EntityPublishingIdNotFound,
      messageParams: ['Season', entityId],
    });
  }

  const snapshotJson: SeasonPublishedEvent = {
    content_id: season.publishing_id,
    tvshow_id: season.tvshow_id
      ? season.tvshow?.publishing_id ||
        buildBDPublishingId(
          'TVSHOW',
          season.tvshow!.title,
          season.tvshow!.external_id!, // TODO: Can we improve this logic?
        )
      : undefined,
    original_title: season.title,
    index: season.index,
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
      countries: license.countries.map((country) => country.country_code ?? ''),
    })),
    images: seasonImages,
    videos,
    directors: season.directors.map((d) => d.name),
    extended_field: season.extended_field ?? undefined,
    rating: season.rating ?? undefined,
    age_rating: season.age_rating ?? undefined,
    asset_type: 2,
    asset_subtype: 'Season',
    localizations: localizations ?? [
      {
        is_default_locale: true,
        language_tag: DEFAULT_LOCALE_TAG,
        title: season.title,
        synopsis: season.synopsis ?? undefined,
        description: season.description ?? undefined,
      },
    ],
  };

  return {
    result: snapshotJson,
    validation: [
      ...seasonImageValidations,
      ...videosValidation,
      ...localizationsValidation,
    ],
  };
};

export const publishingSeasonProcessor: EntityPublishingProcessor = {
  type: 'seasons',
  aggregator: seasonDataAggregator,
  validationSchema: SeasonPublishedEventSchema,
  publishMessagingSettings: PublishServiceMessagingSettings.SeasonPublished,
  unpublishMessagingSettings: PublishServiceMessagingSettings.SeasonUnpublished,
};
