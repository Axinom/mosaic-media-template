import { BulkEntityInput } from '../types/bulk-entity-input';
/**
 * Delete a single entity command schema.
 */
export interface DeleteEntityCommand {
  /**
   * The name of the database table to use.
   */
  table_name: string;
  /**
   * The name of the primary key column for the database table to use.
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
  /**
   * Additional input data.
   */
  input?: BulkEntityInput;
}