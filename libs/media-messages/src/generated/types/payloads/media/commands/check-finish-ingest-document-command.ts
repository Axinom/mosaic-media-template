/**
 * Check finish ingest document command schema.
 */
export interface CheckFinishIngestDocumentCommand {
  /**
   * A unique identifier that is used to track ingest messages for a single document to keep ingest document status up-to-date.
   */
  ingest_document_id: number;
  /**
   * Number of ingest items in ERROR state at the end of previous check.
   */
  previous_error_count: number;
  /**
   * Number of ingest items in SUCCESS state at the end of previous check.
   */
  previous_success_count: number;
  /**
   * Number of ingest items in IN_PROGRESS state at the end of previous check.
   */
  previous_in_progress_count: number;
  /**
   * Seconds counter to track the amount of time when no progress was made, no change in 3 count values. If this counter reaches 600 (10 min) - document processing is considered as failed for an unknown reason, e.g. somehow the whole process froze.
   */
  seconds_without_progress: number;
}