export const CommonErrors = {
  ChannelNotFound: {
    message: 'Channel was not found.',
    code: 'CHANNEL_NOT_FOUND',
  },
  PlaylistNotFound: {
    message: 'Playlist was not found.',
    code: 'PLAYLIST_NOT_FOUND',
  },
  UnableRetrieveImageDetails: {
    message: 'Unable to retrieve images details.',
    code: 'UNABLE_RETRIEVE_IMAGE_DETAILS',
  },
  ImageDetailsRequestFailed: {
    message: 'Request to retrieve image details has failed.',
    code: 'IMAGE_DETAILS_REQUEST_FAILED',
  },
  UnableRetrieveVideoDetails: {
    message: 'Unable to retrieve video details.',
    code: 'UNABLE_RETRIEVE_VIDEO_DETAILS',
  },
  VideoDetailsRequestFailed: {
    message: 'Request to retrieve video details has failed.',
    code: 'VIDEO_DETAILS_REQUEST_FAILED',
  },
  ServiceNotAccessible: {
    message: 'The %s service is not accessible. Please contact Axinom support.',
    code: 'SERVICE_NOT_ACCESSIBLE',
  },
  UnableToGetLocalizations: {
    message:
      'Unable to get the localizations for publishing. Please contact Axinom Support.',
    code: 'UNABLE_TO_GET_LOCALIZATIONS',
  },
  MissingKeyLocalizationProperties: {
    message:
      'The retrieved localizations are missing key properties. Please contact Axinom Support.',
    code: 'MISSING_KEY_LOCALIZATION_PROPERTIES',
  },
  UnableToGetMediaLocalizations: {
    message: 'Unable to get existing localizations for the media entities.',
    code: 'UNABLE_TO_GET_MEDIA_LOCALIZATIONS',
  },
} as const;
