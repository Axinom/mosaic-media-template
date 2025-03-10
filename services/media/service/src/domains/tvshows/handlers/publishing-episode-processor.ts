import { isNullOrWhitespace, MosaicError } from '@axinom/mosaic-service-common';
import {
  EpisodePublishedEvent,
  EpisodePublishedEventSchema,
  License,
  PublishServiceMessagingSettings,
} from 'media-messages';
import * as Yup from 'yup';
import {
  parent,
  Queryable,
  select,
  selectExactlyOne,
  selectOne,
} from 'zapatos/db';
import { CommonErrors, Config, DEFAULT_LOCALE_TAG } from '../../../common';
import {
  atLeastOneString,
  buildBDPublishingId,
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
import {
  getEpisodeLocalizationsMetadata,
  getEpisodeLocalizedImagesMetadata,
} from '../localization';

const applyImageFallbacks = (images: any[]) => {
  const primaryToSecondaryMap = {
    EPISODE_COVER: ['EPISODE_COVER_1x1', 'EPISODE_COVER_16x9'],
    EPISODE_CLEAN_COVER: [
      'EPISODE_CLEAN_COVER_1x1',
      'EPISODE_CLEAN_COVER_16x9',
    ],
    EPISODE_LIST: ['EPISODE_LIST_1x1', 'EPISODE_LIST_9x13'],
  };

  const result = [...images];

  Object.entries(primaryToSecondaryMap).forEach(([primary, secondaries]) => {
    const primaryImage = images.find((img) => img.type === primary);
    if (primaryImage) {
      secondaries.forEach((secondary) => {
        const hasSecondary = images.some((img) => img.type === secondary);
        if (!hasSecondary) {
          result.push({
            ...primaryImage,
            type: secondary,
          });
        }
      });
    }
  });

  // Filter out primary image types
  return result.filter(
    (img) =>
      !['EPISODE_COVER', 'EPISODE_CLEAN_COVER', 'EPISODE_LIST'].includes(
        img.type,
      ),
  );
};

/**
 * Builds episode license objects from license data
 */
const buildEpisodeLicenses = async (
  licenses: any[],
  contentOwner: string | null,
  queryable: Queryable,
): Promise<License[]> => {
  const episodeLicenses: License[] = [];
  for (const license of licenses) {
    const episodeLicense: License = {
      start_time: license.license_start ?? undefined,
      end_time: license.license_end ?? undefined,
      is_downloadable: license.is_downloadable,
      downloaded_asset_lifespan: license.downloaded_asset_lifespan ?? undefined,
      content_owner: contentOwner ?? undefined,
      countries: [],
    };
    for (const country of license.countries) {
      if (!isNullOrWhitespace(country.country_group_id)) {
        const countryGroupCountries = await select('country_groups_countries', {
          group_id: country.country_group_id,
        }).run(queryable);
        episodeLicense.countries?.push(
          ...countryGroupCountries
            .filter((c) => !episodeLicense.countries?.includes(c.country_id))
            .map((c) => c.country_id),
        );
      } else if (
        !isNullOrWhitespace(country.country_code) &&
        !episodeLicense.countries?.includes(country.country_code)
      ) {
        episodeLicense.countries?.push(country.country_code);
      }
    }
    episodeLicenses.push(episodeLicense);
  }
  return episodeLicenses;
};

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
        directors: select('episodes_directors', { episode_id: parent('id') }),
        trailers: select('episodes_trailers', {
          episode_id: parent('id'),
        }),
        genres: select('episodes_tvshow_genres', {
          episode_id: parent('id'),
        }),
        productionCountries: select('episodes_production_countries', {
          episode_id: parent('id'),
        }),
        season: selectOne('seasons', {
          id: parent('season_id'),
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
      episode.main_video_id,
      episode.trailers,
    ),
    getImagesMetadata(config.imageServiceBaseUrl, authToken, episode.images),
    getEpisodeLocalizationsMetadata(config, authToken, episode.id.toString()),
  ]);

  const imageLocalizations = await getEpisodeLocalizedImagesMetadata(
    episode.id,
    localizations,
    config.imageServiceBaseUrl,
    authToken,
  );

  const episodeImages = applyImageFallbacks(images);

  const episodeImageValidations = imagesValidation;
  imageLocalizations.forEach((localization) => {
    const localizedImages = applyImageFallbacks(localization.result);
    episodeImages.push(
      ...localizedImages.map((image) => {
        return {
          ...image,
          language_tag: localization.language_tag,
        };
      }),
    );
    episodeImageValidations.push(
      ...localization.validation.map((validation) => {
        return {
          ...validation,
        };
      }),
    );
  });

  const mainVideo = videos.filter((video) => (video.type = 'MAIN'))?.[0];
  if (episode.publishing_id === undefined || episode.publishing_id === null) {
    throw new MosaicError({
      ...CommonErrors.EntityPublishingIdNotFound,
      messageParams: ['TVShow', entityId],
    });
  }

  const episodeLicenses = await buildEpisodeLicenses(
    episode.licenses,
    episode.content_owner,
    queryable,
  );

  const snapshotJson: EpisodePublishedEvent = {
    content_id: episode.publishing_id,
    season_id: episode.season_id
      ? episode.season?.publishing_id ||
        buildBDPublishingId(
          'EPISODE',
          episode.season!.title,
          episode.season!.external_id!, // TODO: Can we improve this logic?
        )
      : undefined,
    index: episode.index,
    original_title: episode.original_title ?? undefined,
    released: episode.released ?? undefined,
    studio: episode.studio ?? undefined,
    production_countries: episode.productionCountries.map((c) => c.name),
    genre_ids: episode.genres.map((g) =>
      buildPublishingId('tvshow_genres', g.tvshow_genres_id),
    ),
    cast: episode.cast.map((c) => c.name),
    tags: episode.tags.map((c) => c.name),
    licenses: episodeLicenses,
    images: episodeImages,
    videos,
    directors: episode.directors.map((d) => d.name),
    credits_start_time:
      mainVideo?.cue_points?.filter(
        (cue_point) => cue_point.cue_point_type_key === 'CREDIT_START',
      )[0]?.time_in_seconds !== undefined
        ? String(
            mainVideo?.cue_points?.filter(
              (cue_point) => cue_point.cue_point_type_key === 'CREDIT_START',
            )[0]?.time_in_seconds,
          )
        : undefined,
    intro_start_time:
      mainVideo?.cue_points?.filter(
        (cue_point) => cue_point.cue_point_type_key === 'INTRO_START',
      )[0]?.time_in_seconds !== undefined
        ? String(
            mainVideo?.cue_points?.filter(
              (cue_point) => cue_point.cue_point_type_key === 'INTRO_START',
            )[0]?.time_in_seconds,
          )
        : undefined,
    intro_end_time:
      mainVideo?.cue_points?.filter(
        (cue_point) => cue_point.cue_point_type_key === 'INTRO_FINISH',
      )[0]?.time_in_seconds !== undefined
        ? String(
            mainVideo?.cue_points?.filter(
              (cue_point) => cue_point.cue_point_type_key === 'INTRO_FINISH',
            )[0]?.time_in_seconds,
          )
        : undefined,
    length_in_seconds: mainVideo?.length_in_seconds,
    extended_field: episode.extended_field ?? undefined,
    rating: episode.rating ?? undefined,
    age_rating: episode.age_rating ?? undefined,
    asset_type: 1,
    asset_subtype: 'Episode',
    localizations: localizations ?? [
      {
        is_default_locale: true,
        language_tag: DEFAULT_LOCALE_TAG,
        title: episode.title,
        synopsis: episode.synopsis ?? undefined,
        description: episode.description ?? undefined,
      },
    ],
  };

  return {
    result: snapshotJson,
    validation: [
      ...episodeImageValidations,
      ...videosValidation,
      ...localizationsValidation,
    ],
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
  //validator: customEpisodeValidation,
  validationSchema: EpisodePublishedEventSchema,
  publishMessagingSettings: PublishServiceMessagingSettings.EpisodePublished,
  unpublishMessagingSettings:
    PublishServiceMessagingSettings.EpisodeUnpublished,
};
