/**
 * Prepare live stream for the Channel.
 */
export interface PrepareChannelLiveStreamCommand {
  /**
   * Unique identifier of the channel.
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