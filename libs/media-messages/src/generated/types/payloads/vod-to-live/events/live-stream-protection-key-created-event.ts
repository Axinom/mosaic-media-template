/**
 * DRM protection key for Channel was created.
 */
export interface LiveStreamProtectionKeyCreatedEvent {
  /**
   * Unique identifier of the channel.
   */
  channel_id: string;
  /**
   * Unique identifier of the protection key.
   */
  key_id: string;
}