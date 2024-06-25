/**
 * Unpublish format for channel.
 */
export interface ChannelUnpublishedEvent {
  /**
   * Content ID of a channel. Must match the pattern`^(channel)-([a-zA-Z0-9_-]+)$.`
   */
  content_id: string;
}