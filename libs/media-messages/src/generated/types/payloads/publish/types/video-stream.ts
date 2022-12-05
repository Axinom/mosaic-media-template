import { Format } from './format';
import { VideoStreamType } from './video-stream-type';
/**
 * Video stream metadata
 */
export interface VideoStream {
  /**
   * Key ID
   */
  key_id?: string | null;
  /**
   * Stream label for grouping streams by the same quality level: audio, sd, hd, uhd1, uhd2.
   */
  label?: string;
  /**
   * Packaging format of the stream
   */
  format?: Format;
  /**
   * Stream type
   */
  type?: VideoStreamType;
  /**
   * File path to the initialization segment
   */
  file?: string | null;
  /**
   * The initialization vector that was used to encrypt this media file.
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
   * Codecs
   */
  codecs?: string | null;
  /**
   * Frame rate of the video stream
   */
  frame_rate?: number | null;
  /**
   * Height of the video stream
   */
  height?: number | null;
  /**
   * Width of the video stream
   */
  width?: number | null;
  /**
   * Display aspect ratio for video streams
   */
  display_aspect_ratio?: string | null;
  /**
   * Pixel aspect ratio for video streams
   */
  pixel_aspect_ratio?: string | null;
  /**
   * Sampling rate for audio streams
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
}