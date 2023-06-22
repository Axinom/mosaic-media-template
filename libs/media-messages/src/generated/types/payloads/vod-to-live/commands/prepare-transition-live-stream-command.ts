/**
 * Prepare live stream for the Playlist.
 */
export interface PrepareTransitionLiveStreamCommand {
  /**
   * Unique identifier of the channel.
   */
  channel_id: string;
  /**
   * Unique identifier of the playlist.
   */
  playlist_id: string;
  /**
   * Start date and time of the transition.
   */
  transition_start_date_time: string;
  /**
   * SMIL document's XML content serialized as JSON string.
   */
  smil: string;
}