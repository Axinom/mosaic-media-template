/**
 * Check finish ingest item command schema.
 */
export interface CheckFinishIngestItemCommand {
  /**
   * A string with at least one character and not only whitespace characters.
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