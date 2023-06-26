/**
 * Check finish ingest item command schema.
 */
export interface CheckFinishIngestItemCommand {
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
   */
  ingest_item_step_id: string;
  /**
   * Id of an ingest item stored in the database.
   */
  ingest_item_id: number;
  /**
   * Message that describes why a message for a specific ingest_item_step_id has failed.
   */
  error_message?: string;
}