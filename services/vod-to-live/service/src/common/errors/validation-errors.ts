export const ValidationErrors = {
  // Channel validation messages
  ChannelMissingPlaceholderVideo: {
    message: 'Channel must have placeholder video assigned.',
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
      'Playlist duration is under 24 hours. Playlist will be prolonged with placeholder video to hit 24 hours duration.',
    code: 'PLAYLIST_PROLONGATION',
  },
  PlaylistIsTooOld: {
    message: 'Playlist start date is older than 24 hours.',
    code: 'PLAYLIST_START_DATE_TOO_OLD',
  },
  PlaylistCannotStartAndEndWithAdPod: {
    message: 'Playlist cannot start and end with "AD_POD".',
    code: 'PLAYLIST_CANNOT_START_AND_END_WITH_AD_POD',
  },
  PlaylistVideosHaveNoMutualStreams: {
    message: 'Videos in the playlist have no mutual stream formats.',
    code: 'PLAYLIST_VIDEOS_HAVE_NO_MUTUAL_STREAMS',
  },
  PlaylistPlaceholderVideoWasNotFound: {
    message: 'Placeholder video for the playlist was not found.',
    code: 'PLAYLIST_PLACEHOLDER_VIDEO_WAS_NOT_FOUND',
  },
  // General validation messages
  ValidationFailed: {
    message: `Unexpected error happened while validating message.`,
    code: `VALIDATION_FAILED`,
  },
  ValidationNotPossible: {
    message: `Received message cannot be validated.`,
    code: `VALIDATION_NOT_POSSIBLE`,
  },
};
