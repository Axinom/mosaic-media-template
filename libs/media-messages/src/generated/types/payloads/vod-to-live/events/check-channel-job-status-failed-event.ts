/**
 * Channel has failed processing. The live stream was not created.
 */
export interface CheckChannelJobStatusFailedEvent {
  /**
   * A string with at least one character and not only whitespace characters.
   */
  channel_id: string;
  /**
   * Message that describes a reason for command processing failure.
   */
  message: string;

  [k: string]: unknown;
}