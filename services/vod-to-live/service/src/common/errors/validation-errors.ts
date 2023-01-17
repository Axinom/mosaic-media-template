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
    message: 'Playlist exceeds 24 hours',
    code: 'PLAYLIST_EXCEEDS_24_HOURS',
  },
  PlaylistExceeds25Hours: {
    message: 'Playlist exceeds 25 hours',
    code: 'PLAYLIST_EXCEEDS_25_HOURS',
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
