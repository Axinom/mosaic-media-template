import { StreamType } from './stream-type';
import { VideoOutputFormat } from './video-output-format';
/**
 * Information about the video streams for the video encoding.
 */
export interface Stream {
  /**
   * Stream label for grouping streams by the same quality level: audio, sd, hd, uhd1, uhd2.
   */
  label: string;
  /**
   * Output format.
   */
  format: VideoOutputFormat;
  /**
   * Stream type
   */
  type?: StreamType;
  /**
   * File path to the initialization segment
   */
  file?: string | null;
  /**
   * Key ID
   */
  key_id?: string | null;
  /**
   * IV
   */
  iv?: string | null;
  /**
   * Bitrate in kilobits per second
   */
  bitrate_in_kbps?: number | null;
  /**
   * File Template
   */
  file_template?: string | null;
  /**
   * The used codec like H.264 (AVC), H.265 (HEVC), AAC, ...
   */
  codecs?: string | null;
  /**
   * Frames per second of the video stream
   */
  frame_rate?: number | null;
  /**
   * Height in pixels of the video stream
   */
  height?: number | null;
  /**
   * Width in pixels of the video stream
   */
  width?: number | null;
  /**
   * The proportional relationship between the width and the height of how to display the video like 16:9, 4:3, 3:2, ...
   */
  display_aspect_ratio?: string | null;
  /**
   * This ratio describes how the width of a pixel compares to the height of that pixel e.g. 1:1. But pixels are not always square.
   */
  pixel_aspect_ratio?: string | null;
  /**
   * The average number of samples in one second for audio streams.
   */
  sampling_rate?: number | null;
  /**
   * Language code for for audio, subtitle, or caption streams
   */
  language_code?: string | null;
  /**
   * Language name for audio, subtitle, or caption streams
   */
  language_name?: string | null;

  [k: string]: unknown;
}