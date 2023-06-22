/**
 * Channel has failed processing. The live stream was not created.
 */
export interface CheckChannelJobStatusFailedEvent {
  /**
   * Unique identifier of the channel.
   */
  channel_id: string;
  /**
   * Message that describes a reason for command processing failure.
   */
  message: string;

  [k: string]: unknown;
}