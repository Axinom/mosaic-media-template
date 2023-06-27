/**
 * An entity was deleted as part of a background job schema.
 */
export interface EntityDeletedEvent {
  /**
   * A string with at least one character and not only whitespace characters.
   */
  table_name: string;
  /**
   * A string with at least one character and not only whitespace characters.
   */
  primary_key_name: string;
  /**
   * Id of the entity that was deleted.
   */
  entity_id: number;
}