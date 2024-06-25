import { Stream } from './stream';
import { VideoEncodingState } from './video-encoding-state';
import { VideoOutputFormat } from './video-output-format';
import { VideoPreviewStatus } from './video-preview-status';
/**
 * Information about specific video encoding.
 */
export interface Encoding {
  /**
   * Is video DRM-protected or not
   */
  is_protected: boolean;
  /**
   * Video title
   */
  title?: string;
  /**
   * Encoding state.
   */
  encoding_state: VideoEncodingState;
  /**
   * Output format.
   */
  output_format: VideoOutputFormat;
  /**
   * Output location
   */
  output_location?: string;
  /**
   * DASH output size in bytes
   */
  dash_size_in_bytes?: number | null;
  /**
   * HLS output size in bytes
   */
  hls_size_in_bytes?: number | null;
  /**
   * CMAF output size in bytes
   */
  cmaf_size_in_bytes?: number | null;
  /**
   * Path to the DASH manifest in the output storage
   */
  dash_manifest_path?: string | null;
  /**
   * Path to the HLS manifest in the output storage
   */
  hls_manifest_path?: string | null;
  /**
   * An array of audio language values.
   */
  audio_languages: (string | null)[];
  /**
   * An array of closed caption language values.
   */
  caption_languages: (string | null)[];
  /**
   * An array of subtitle language values.
   */
  subtitle_languages: (string | null)[];
  /**
   * Video length in seconds
   */
  length_in_seconds?: number | null;
  /**
   * ISO 8601 Datetime when the encoding finished
   */
  finished_date?: string | null;
  /**
   * Preview status.
   */
  preview_status: VideoPreviewStatus;
  /**
   * Preview comment
   */
  preview_comment?: string | null;
  /**
   * An array of video stream objects.
   */
  video_streams: Stream[];

  [k: string]: unknown;
}