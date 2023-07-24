/**
 * Channel live stream is live.
 */
export interface CheckChannelJobStatusSucceededEvent {
  /**
   * A string with at least one character and not only whitespace characters.
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