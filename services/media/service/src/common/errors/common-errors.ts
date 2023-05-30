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
} as const;
