import { Dict } from '@axinom/mosaic-db-common';
import { localizableCollectionDbMigrationPlaceholders } from './collections/localization/localizable-collection-db-migration-placeholders';
import { localizableMovieDbMigrationPlaceholders } from './movies/localization/localizable-movie-db-migration-placeholders';
import { localizableEpisodeDbMigrationPlaceholders } from './tvshows/localization/localizable-episode-db-migration-placeholders';
import { localizableSeasonDbMigrationPlaceholders } from './tvshows/localization/localizable-season-db-migration-placeholders';
import { localizableTvshowDbMigrationPlaceholders } from './tvshows/localization/localizable-tvshow-db-migration-placeholders';

/**
 * DB migration settings that are passed as placeholders to the graphile-migrate config.
 * If some placeholder value changes - new DB migration must be applied to
 * re-run `app_hidden.create_localizable_entity_triggers` calls that were using
 * affected placeholders.
 */
export const localizationDbMigrationPlaceholders: Dict<string> = {
  ...localizableMovieDbMigrationPlaceholders,
  ...localizableTvshowDbMigrationPlaceholders,
  ...localizableSeasonDbMigrationPlaceholders,
  ...localizableEpisodeDbMigrationPlaceholders,
  ...localizableCollectionDbMigrationPlaceholders,
};
