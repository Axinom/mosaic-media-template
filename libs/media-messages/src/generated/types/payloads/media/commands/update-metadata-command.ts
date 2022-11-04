import { Item } from '../types/item';
/**
 * Update metadata command schema.
 */
export interface UpdateMetadataCommand {
  /**
   * Id of a media item stored in the database that is associated with specific ingest item.
   */
  entity_id: number;
  /**
   * Contents of a specific ingest item.
   */
  item: Item;
}