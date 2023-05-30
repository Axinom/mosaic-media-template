import { Item } from '../types/item';
/**
 * Start ingest item command schema.
 */
export interface StartIngestItemCommand {
  /**
   * Id of an ingest item stored in the database.
   */
  ingest_item_id: number;
  /**
   * Id of a media item stored in the database that is associated with specific ingest item.
   */
  entity_id: number;
  /**
   * Contents of a specific ingest item.
   */
  item: Item;
}