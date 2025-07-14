/**
 * Entity publish failed event schema.
 */
export interface EntityPublishFailedEvent {
  /**
   * Content id of the entity that was deleted.
   */
  content_id: string;
  /**
   * Message that describes the reason for entity publication failure.
   */
  message: string;
}