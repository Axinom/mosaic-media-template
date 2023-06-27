/**
 * DRM protection key for Channel was created.
 */
export interface LiveStreamProtectionKeyCreatedEvent {
  /**
   * A string with at least one character and not only whitespace characters.
   */
  channel_id: string;
  /**
   * A UUID.
   */
  key_id: string;
}