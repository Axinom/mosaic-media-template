/**
 * Unpublish a single entity command schema.
 */
export interface UnpublishEntityCommand {
  /**
   * A string with at least one character and not only whitespace characters.
   */
  table_name: string;
  /**
   * Id of the selected entity.
   */
  entity_id: number;
}