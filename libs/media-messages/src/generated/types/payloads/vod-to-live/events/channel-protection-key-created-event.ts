/**
 * DRM protection key for Channel was created.
 */
export interface ChannelProtectionKeyCreatedEvent {
  /**
   * Unique identifier of the channel.
   */
  channel_id: string;
  /**
   * Unique identifier of the key.
   */
  key_id: string;
}