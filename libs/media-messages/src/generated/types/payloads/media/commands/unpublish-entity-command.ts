/**
 * Unpublish a single entity command schema.
 */
export interface UnpublishEntityCommand {
  /**
   * The name of the database table to use.
   */
  table_name: string;
  /**
   * Id of the selected entity.
   */
  entity_id: number;
}