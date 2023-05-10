export const ValidationErrors = {
  // Channel validation messages
  ChannelMissingPlaceholderVideo: {
    message: 'A placeholder video must be assigned to the channel.',
    code: 'CHANNEL_MISSING_PLACEHOLDER_VIDEO',
  },
  // Playlist validation messages
  PlaylistMissingPrograms: {
    message: 'Playlist must contain at least one program.',
    code: 'PLAYLIST_MISSING_PROGRAMS',
  },
  PlaylistExceeds24Hours: {
    message: 'Playlist duration exceeds 24 hours.',
    code: 'PLAYLIST_EXCEEDS_24_HOURS',
  },
  PlaylistExceeds25Hours: {
    message: 'Playlist duration exceeds 25 hours.',
    code: 'PLAYLIST_EXCEEDS_25_HOURS',
  },
  PlaylistProlongation: {
    message:
      'The playlist duration is less than 24 hours. To reach a total duration of 24 hours, a placeholder video will be looped multiple times at the end of the playlist.',
    code: 'PLAYLIST_PROLONGATION',
  },
  PlaylistIsTooOld: {
    message: 'The playlist start date is more than 24 hours ago.',
    code: 'PLAYLIST_START_DATE_TOO_OLD',
  },
  PlaylistCannotStartAndEndWithAdPod: {
    message: 'The playlist cannot begin and end with an "AD_POD".',
    code: 'PLAYLIST_CANNOT_START_AND_END_WITH_AD_POD',
  },
  PlaylistVideosHaveNoMutualStreams: {
    message: 'The videos in the playlist do not share a common stream format.',
    code: 'PLAYLIST_VIDEOS_HAVE_NO_MUTUAL_STREAMS',
  },
  PlaylistPlaceholderVideoWasNotFound: {
    message: 'The placeholder video for the playlist could not be found.',
    code: 'PLAYLIST_PLACEHOLDER_VIDEO_WAS_NOT_FOUND',
  },
  // General validation messages
  ValidationFailed: {
    message: `Unexpected error happened while validating message.`,
    code: `VALIDATION_FAILED`,
  },
  ValidationNotPossible: {
    message: `The message received cannot be validated.`,
    code: `VALIDATION_NOT_POSSIBLE`,
  },
};
