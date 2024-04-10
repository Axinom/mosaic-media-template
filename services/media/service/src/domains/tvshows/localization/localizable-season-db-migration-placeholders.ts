import { SeasonFieldDefinitions } from './get-tvshow-localization-entity-definitions';

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
export const localizableSeasonDbMigrationPlaceholders = {
  // If season is assigned to a different tvshow - need to record this to
  // update computed entityTitle
  ':SEASON_LOCALIZABLE_FIELDS':
    SeasonFieldDefinitions.map((d) => d.field_name).join(',') + ',tvshow_id',
  // tvshow_id is always included to make sure entityTitle is generated
  // fully on metadata updates
  ':SEASON_LOCALIZATION_REQUIRED_FIELDS': 'id,index,tvshow_id',
  ':SEASON_IMAGE_LOCALIZABLE_FIELDS': 'image_id',
  ':SEASON_IMAGE_LOCALIZATION_REQUIRED_FIELDS': 'season_id,image_id,image_type',
};
