/**
 * Episode unpublished event.
 */
export interface EpisodeUnpublishedEvent {
  /**
   * Content ID of a TV show episode. Must match the pattern `^(episode)-([a-zA-Z0-9_-]+)$`.
   */
  content_id: string;
}