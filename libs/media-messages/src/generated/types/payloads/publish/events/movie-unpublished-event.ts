/**
 * Movie unpublished event.
 */
export interface MovieUnpublishedEvent {
  /**
   * Content ID of a movie. Must match the pattern`^(movie)-([a-zA-Z0-9_-]+)$.`
   */
  content_id: string;
}