/**
 * Review unpublished event.
 */
export interface ReviewUnpublishedEvent {
  /**
   * Content ID of a review. Must match the pattern`^(review)-([a-zA-Z0-9_-]+)$.`
   */
  content_id: string;
}