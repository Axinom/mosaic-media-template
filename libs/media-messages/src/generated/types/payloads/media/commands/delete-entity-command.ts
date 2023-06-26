/**
 * Delete a single entity command schema.
 */
export interface DeleteEntityCommand {
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
   */
  table_name: string;
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
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