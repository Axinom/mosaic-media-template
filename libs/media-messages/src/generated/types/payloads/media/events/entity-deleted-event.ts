/**
 * An entity was deleted as part of a background job schema.
 */
export interface EntityDeletedEvent {
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
   */
  table_name: string;
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
   */
  primary_key_name: string;
  /**
   * Id of the entity that was deleted.
   */
  entity_id: number;
}