/**
 * Season unpublished event.
 */
export interface SeasonUnpublishedEvent {
  /**
   * Content ID of a TV show season. Must match the pattern `^(season)-([a-zA-Z0-9_-]+)$`.
   */
  content_id: string;
}