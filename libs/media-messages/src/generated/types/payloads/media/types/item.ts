import { IngestItemData } from './ingest-item-data';
import { IngestItemType } from './ingest-item-type';
/**
 * Contents of a specific ingest item.
 */
export interface Item {
  /**
   * Type that specifies type of media item to be created or updated using this ingest item data.
   */
  type: IngestItemType;
  /**
   * Type that specifies type of media item to be created or updated using this ingest item data.
   */
  external_id: string;
  /**
   * Metadata of a specific ingest item.
   */
  data: IngestItemData;
}