/**
 * Prepare live stream for the Channel.
 */
export interface PrepareChannelLiveStreamCommand {
  /**
   * A string with at least one character and not only whitespace characters.
   */
  channel_id: string;
  /**
   * Apply DRM protection on the output stream.
   */
  is_drm_protected: boolean;
  /**
   * SMIL document's XML content serialized as JSON string.
   */
  smil: string;
  /**
   * JSON representation of the channel.
   */
  json: string;
}