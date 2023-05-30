/**
 * TV show unpublished event.
 */
export interface TvshowUnpublishedEvent {
  /**
   * Content ID of a TV show. Must match the pattern `^(tvshow)-([a-zA-Z0-9_-]+)$`.
   */
  content_id: string;
}