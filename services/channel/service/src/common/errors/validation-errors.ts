export const ValidationErrors = {
  // Channel
  AssociatedChannelNotPublished: {
    message: 'The channel associated with the playlist was changed.',
    code: 'ASSOCIATED_CHANNEL_NOT_PUBLISHED',
  },
  CannotUnpublishNotPublishedChannel: {
    message: 'The channel cannot be unpublished as it is not published.',
    code: 'CANNOT_UNPUBLISH_NOT_PUBLISHED_CHANNEL',
  },
  FailedChannelPrePublishValidation: {
    message: 'The channel pre-publish validation failed.',
    code: 'FAILED_CHANNEL_PRE_PUBLISH_VALIDATION',
  },
  ChannelChangedSinceValidation: {
    message:
      'The channel has been changed after the validation check was done. Please restart the channel validation check and retry the publication.',
    code: 'CHANNEL_CHANGED_SINCE_VALIDATION',
  },
  // Playlist
  CannotUnpublishNotPublishedPlaylist: {
    message: 'The playlist cannot be unpublished as it is not published.',
    code: 'CANNOT_UNPUBLISH_NOT_PUBLISHED_PLAYLIST',
  },
  FailedPlaylistPrePublishValidation: {
    message: 'Playlist pre-publish validation failed.',
    code: 'FAILED_PLAYLIST_PRE_PUBLISH_VALIDATION',
  },
  PlaylistChangedSinceValidation: {
    message:
      'The playlist has been changed after the validation check was done. Please restart the playlist validation check and retry the publication.',
    code: 'PLAYLIST_CHANGED_SINCE_VALIDATION',
  },
  PlaylistMissingPrograms: {
    message: 'The playlist must contain at least one program.',
    code: 'PLAYLIST_MISSING_PROGRAMS',
  },
  PlaylistExceeds24Hours: {
    message: 'The playlist duration exceeds 24 hours.',
    code: 'PLAYLIST_EXCEEDS_24_HOURS',
  },
  PlaylistExceeds25Hours: {
    message: 'The playlist duration exceeds 25 hours.',
    code: 'PLAYLIST_EXCEEDS_25_HOURS',
  },
  PlaylistProlongation: {
    message:
      'The playlist duration is less than 24 hours. To reach a total duration of 24 hours, the channel placeholder video will be looped multiple times at the end of the playlist.',
    code: 'PLAYLIST_PROLONGATION',
  },
  PlaylistIsTooOld: {
    message: 'The playlist start date is more than 24 hours ago.',
    code: 'PLAYLIST_START_DATE_TOO_OLD',
  },
  PlaylistCannotStartAndEndWithAdPod: {
    message: 'The playlist cannot begin and end with an ad pod.',
    code: 'PLAYLIST_CANNOT_START_AND_END_WITH_AD_POD',
  },
  PlaceholderAndPlaylistVideosHaveNoMutualStreams: {
    message:
      'The placeholder video and playlist video(s) must each have at least one stream with the same resolution, frame rate, and bitrate.',
    code: 'PLAYLIST_VIDEOS_HAVE_NO_MUTUAL_STREAMS',
  },
} as const;
