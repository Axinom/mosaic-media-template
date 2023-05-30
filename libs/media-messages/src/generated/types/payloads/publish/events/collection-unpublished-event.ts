/**
 * Collection unpublished event.
 */
export interface CollectionUnpublishedEvent {
  /**
   * Content ID of a collection. Must match the pattern `^(collection)-([a-zA-Z0-9_-]+)$`.
   */
  content_id: string;
}