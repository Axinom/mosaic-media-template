import {
  PublishServiceMessagingSettings,
  TvshowGenre,
  TvshowGenresPublishedEvent,
  TvshowGenresPublishedEventSchema,
} from 'media-messages';
import { all, Queryable, select } from 'zapatos/db';
import { Config, DEFAULT_LOCALE_TAG } from '../../../common';
import {
  buildPublishingId,
  EntityPublishingProcessor,
  SnapshotDataAggregator,
  SnapshotValidationResult,
} from '../../../publishing';
import { getTvshowGenreLocalizationsMetadata } from '../localization';

const tvshowGenresDataAggregator: SnapshotDataAggregator = async (
  _entityId: number,
  authToken: string,
  config: Config,
  queryable: Queryable,
) => {
  const genres = await select('tvshow_genres', all, {
    columns: ['id', 'sort_order', 'title'],
    order: { by: 'sort_order', direction: 'ASC' },
  }).run(queryable);
  const validations: SnapshotValidationResult[] = [];
  const mappedGenres: TvshowGenre[] = [];
  for (const genre of genres) {
    const { result: localizations, validation: localizationsValidation } =
      await getTvshowGenreLocalizationsMetadata(
        config,
        authToken,
        genre.id.toString(),
        genre.title,
      );
    mappedGenres.push({
      order_no: genre.sort_order,
      content_id: buildPublishingId('tvshow_genres', genre.id),
      localizations: localizations ?? [
        {
          is_default_locale: true,
          language_tag: DEFAULT_LOCALE_TAG,
          title: genre.title,
        },
      ],
    });

    validations.push(...localizationsValidation);
  }
  const snapshotJson: TvshowGenresPublishedEvent = {
    genres: mappedGenres,
  };

  return {
    result: snapshotJson,
    validation:
      genres.length > 0
        ? validations
        : [
            {
              message: 'At least one genre must exist.',
              severity: 'ERROR',
              context: 'METADATA',
            },
          ],
  };
};

export const publishingTvshowGenresProcessor: EntityPublishingProcessor = {
  type: 'tvshow_genres',
  aggregator: tvshowGenresDataAggregator,
  validationSchema: TvshowGenresPublishedEventSchema,
  publishMessagingSettings:
    PublishServiceMessagingSettings.TvshowGenresPublished,
  unpublishMessagingSettings:
    PublishServiceMessagingSettings.TvshowGenresUnpublished,
};
