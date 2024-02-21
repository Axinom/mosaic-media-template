/**
 * Prepare live stream for the Playlist.
 */
export interface PrepareTransitionLiveStreamCommand {
  /**
   * A string with at least one character and not only whitespace characters.
   */
  channel_id: string;
  /**
   * A string with at least one character and not only whitespace characters.
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