/**
 * Channel has failed processing. The live stream was not created.
 */
export interface CheckChannelJobStatusFailedEvent {
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
   */
  channel_id: string;
  /**
   * Message that describes a reason for command processing failure.
   */
  message: string;

  [k: string]: unknown;
}