/**
 * Channel live stream is live.
 */
export interface CheckChannelJobStatusSucceededEvent {
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
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