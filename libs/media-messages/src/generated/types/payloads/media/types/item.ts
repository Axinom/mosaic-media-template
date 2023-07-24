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
   * A string with at least one character and not only whitespace characters.
   */
  external_id: string;
  data: { [name: string]: unknown };
}