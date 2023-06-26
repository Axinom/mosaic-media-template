/**
 * DRM protection key for Channel was created.
 */
export interface LiveStreamProtectionKeyCreatedEvent {
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
   */
  channel_id: string;
  /**
   * A UUID.
   */
  key_id: string;
}