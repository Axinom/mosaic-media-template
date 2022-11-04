/**
 * An entity was deleted as part of a background job schema.
 */
export interface EntityDeletedEvent {
  /**
   * The name of the table from which the entity was deleted.
   */
  table_name: string;
  /**
   * The name of the primary key column for the table from which the entity was deleted.
   */
  primary_key_name: string;
  /**
   * Id of the entity that was deleted.
   */
  entity_id: number;
}