/**
 * Prepare live stream for the Playlist.
 */
export interface PrepareTransitionLiveStreamCommand {
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
   */
  channel_id: string;
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
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