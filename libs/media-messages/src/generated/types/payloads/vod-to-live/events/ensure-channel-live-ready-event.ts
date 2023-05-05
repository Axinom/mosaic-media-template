/**
 * Channel live stream is live.
 */
export interface EnsureChannelLiveReadyEvent {
  /**
   * Unique identifier of the channel.
   */
  channel_id: string;
  /**
   * URL pointing to DASH live stream.
   */
  dash_stream_url: string;
  /**
   * URL pointing to HLS live stream.
   */
  hls_stream_url: string;

  [k: string]: unknown;
}