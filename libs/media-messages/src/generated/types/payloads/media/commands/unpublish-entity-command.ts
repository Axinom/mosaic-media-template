/**
 * Unpublish a single entity command schema.
 */
export interface UnpublishEntityCommand {
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
   */
  table_name: string;
  /**
   * Id of the selected entity.
   */
  entity_id: number;
}