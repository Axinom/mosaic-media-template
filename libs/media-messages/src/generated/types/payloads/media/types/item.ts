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
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
   */
  external_id: string;
  data: { [name: string]: unknown };
}