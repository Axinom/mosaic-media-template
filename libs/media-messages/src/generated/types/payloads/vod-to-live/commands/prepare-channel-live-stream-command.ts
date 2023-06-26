/**
 * Prepare live stream for the Channel.
 */
export interface PrepareChannelLiveStreamCommand {
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
   */
  channel_id: string;
  /**
   * SMIL document's XML content serialized as JSON string.
   */
  smil: string;
  /**
   * JSON representation of the channel.
   */
  json: string;
}