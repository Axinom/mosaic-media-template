export const CommonErrors = {
  IngestValidationError: {
    message: 'Ingest Document validation has failed.',
    code: 'INGEST_VALIDATION_ERROR',
  },
  IngestError: {
    message:
      'An error has occurred during the ingest process. The actual message will have more information.',
    code: 'INGEST_ERROR',
  },
  PublishVideosMetadataRequestError: {
    message: 'Unable to retrieve videos metadata.',
    code: 'PUBLISH_VIDEOS_METADATA_REQUEST_ERROR',
  },
  PublishImagesMetadataRequestError: {
    message: 'Unable to retrieve images metadata.',
    code: 'PUBLISH_IMAGES_METADATA_REQUEST_ERROR',
  },
  PublishLocalizationsMetadataRequestError: {
    message: 'Unable to retrieve localizations metadata.',
    code: 'PUBLISH_LOCALIZATIONS_METADATA_REQUEST_ERROR',
  },
  PublishError: {
    message: 'Attempt to publish media has failed.',
    code: 'PUBLISH_ERROR',
  },
  UnpublishError: {
    message: 'Attempt to unpublish media has failed.',
    code: 'UNPUBLISH_ERROR',
  },
  CreateSnapshotError: {
    message: 'Attempt to create a media snapshot has failed.',
    code: 'CREATE_SNAPSHOT_ERROR',
  },
  UnsupportedIngestMediaType: {
    message:
      "Unable to generate display title for ingest item. Ingest media type '%s' is not supported.",
    code: 'UNSUPPORTED_INGEST_MEDIA_TYPE',
  },
  SnapshotNotFound: {
    message: "The snapshot with ID '%s' was not found.",
    code: 'SNAPSHOT_NOT_FOUND',
  },
  MediaNotFound: {
    message: "%s with ID '%s' was not found.",
    code: 'MEDIA_NOT_FOUND',
  },
  NotEnoughPermissions: {
    message:
      'The subject was provided, but it does not have enough permissions to perform the operation.',
    code: 'NOT_ENOUGH_PERMISSIONS',
  },
  ServiceNotAccessible: {
    message:
      'The %s service is not accessible. Please contact the service support.',
    code: 'SERVICE_NOT_ACCESSIBLE',
  },
  MissingKeyLocalizationProperties: {
    message:
      'The retrieved localizations are missing key properties. Please contact the service support.',
    code: 'MISSING_KEY_LOCALIZATION_PROPERTIES',
  },
  CircularCollectionRelationNotAllowed: {
    message:
      'Unable to add because of circular relationship between child collection and parent collection',
    code: 'CIRCULAR_COLLECTION_RELATION_NOT_ALLOWED',
  },
  LicenseStartDateCannotBeAfterEndDate: {
    message: 'License start date cannot be after license end date.',
    code: 'LICENSE_START_DATE_CANNOT_BE_AFTER_END_DATE',
  },
  EntityPublishingIdNotFound: {
    message: 'The publishing ID for %s with ID %s was not found.',
    code: 'ENTITY_PUBLISHING_ID_NOT_FOUND',
  },
  CannotUpdateExternalIdForPublishedMedia: {
    message:
      'The External ID cannot be updated for %s with ID %s. Please unpublish the media or the entity that is referencing this media such as a Season, Episode or Collection first.',
    code: 'CANNOT_UPDATE_EXTERNAL_ID_FOR_PUBLISHED_MEDIA',
  },
  CannotUpdateExternalId: {
    message:
      'The External ID cannot be updated for %s with ID %s. Only media with no External ID can be updated.',
    code: 'CANNOT_UPDATE_EXTERNAL_ID',
  },
  CannotUpdateTitleForPublishedMedia: {
    message:
      'The Title cannot be updated for %s with ID %s. The title is used to build the Publishing ID when the External ID is empty. Any changes to the title must be done only after unpublishing the media.',
    code: 'CANNOT_UPDATE_TITLE_FOR_PUBLISHED_MEDIA',
  },
} as const;
