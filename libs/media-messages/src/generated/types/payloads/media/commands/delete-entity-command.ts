/**
 * Delete a single entity command schema.
 */
export interface DeleteEntityCommand {
  /**
   * A string with at least one character and not only whitespace characters.
   */
  table_name: string;
  /**
   * A string with at least one character and not only whitespace characters.
   */
  primary_key_name: string;
  /**
   * Id of the selected entity.
   */
  entity_id: number;
  /**
   * The name of the entity type.
   */
  entity_type?: string;
  input?: { [name: string]: unknown };
}