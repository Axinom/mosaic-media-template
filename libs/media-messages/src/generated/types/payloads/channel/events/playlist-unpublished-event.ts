/**
 * Unpublish format for playlist.
 */
export interface PlaylistUnpublishedEvent {
  /**
   * Content ID of a playlist. Must match the pattern `^(playlist)-([a-zA-Z0-9_-]+)$`.
   */
  content_id: string;
  /**
   * Content ID of a channel. Must match the pattern`^(channel)-([a-zA-Z0-9_-]+)$.`
   */
  channel_id: string;
}