import { ReviewFieldDefinitions } from './get-review-localization-entity-definitions';

export const localizableReviewDbMigrationPlaceholders = {
  ':REVIEW_LOCALIZABLE_FIELDS': ReviewFieldDefinitions.map(
    (d) => d.field_name,
  ).join(','),
  ':REVIEW_LOCALIZATION_REQUIRED_FIELDS': 'id',
};
