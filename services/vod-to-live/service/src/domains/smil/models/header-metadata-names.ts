export const HeaderMetadataNames = {
  /**
   * Mandatory header.
   * Marks that the SMIL should be used for VODToLive instead of VOD.
   */
  Vod2Live: 'vod2live',
  /**
   * Mandatory header.
   * Schedule content for playout at a specific point in time.
   * Should contain a valid date-time in a ISO8601 format.
   */
  Vod2LiveStartTime: 'vod2live_start_time',
  /**
   * Mandatory header for transitions with ads.
   * Marks that transition includes support for timed metadata.
   */
  TimedMetadata: 'timed_metadata',
  /**
   * Mandatory header for transitions with ads.
   * Indicates to splice media segments on the splice points when creating the Live server manifest.
   */
  SplicedMedia: 'splice_media',
  /**
   * Header used to define path to the CPIX file for video decryption.
   */
  DecryptCpix: 'decrypt_cpix',
  /**
   * Header used to define path to CPIX for DASH encryption of the stream.
   */
  MpdCpix: 'mpd_cpix',
  /**
   * Header used to define path to CPIX for HLS encryption of the stream.
   */
  HlsCpix: 'hls_cpix',
  /**
   * Mosaic header. Added to the SMIL file generated from the Channel.
   * Should contain a unique identifier of the published Channel.
   */
  MosaicChannelId: 'mosaic_channel_id',
  /**
   * Mosaic header. Added to the SMIL file generated from the Playlist.
   * Should contain a unique identifier of the published Playlist.
   */
  MosaicPlaylistId: 'mosaic_playlist_id',
} as const;
