import {
  MovieFieldDefinitions,
  MovieGenreFieldDefinitions,
} from './get-movie-localization-entity-definitions';

/**
 * DB migration settings that are passed as placeholders to the graphile-migrate config.
 * If some placeholder value changes - new DB migration must be applied to
 * re-run `app_hidden.create_localizable_entity_triggers` calls that were using
 * affected placeholders.
 *
 * `*_LOCALIZABLE_FIELDS` placeholders must contain at least one property. In
 * case of images, while `image_id` is technically not a localizable field - we
 * must track it during update operations to send message to the Mosaic
 * Localization Service whenever image assignment changes for an entity.
 */
export const localizableMovieDbMigrationPlaceholders = {
  ':MOVIE_GENRE_LOCALIZABLE_FIELDS': MovieGenreFieldDefinitions.map(
    (d) => d.field_name,
  ).join(','),
  ':MOVIE_GENRE_LOCALIZATION_REQUIRED_FIELDS': 'id',
  ':MOVIE_LOCALIZABLE_FIELDS': MovieFieldDefinitions.map(
    (d) => d.field_name,
  ).join(','),
  ':MOVIE_LOCALIZATION_REQUIRED_FIELDS': 'id',
  ':MOVIE_IMAGE_LOCALIZABLE_FIELDS': 'image_id',
  ':MOVIE_IMAGE_LOCALIZATION_REQUIRED_FIELDS': 'movie_id,image_id,image_type',
};
