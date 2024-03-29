/**
 * Check channel creation job status.
 */
export interface CheckChannelJobStatusCommand {
  /**
   * A string with at least one character and not only whitespace characters.
   */
  channel_id: string;
  /**
   * Seconds counter to track the amount of time waiting for channel to go live. If this counter reaches configurable amount of minutes - live stream processing is considered as failed for an unknown reason, e.g. somehow the whole process froze.
   */
  seconds_elapsed_while_waiting: number;
}