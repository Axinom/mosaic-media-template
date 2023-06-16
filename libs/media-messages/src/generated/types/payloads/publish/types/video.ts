import { CuePoint } from './cue-point';
import { Format } from './format';
import { VideoStream } from './video-stream';
import { VideoUsageType } from './video-usage-type';
/**
 * Video metadata.
 */
export interface Video {
  /**
   * Type of the video stream.
   */
  type: VideoUsageType;
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
   */
  title: string;
  /**
   * Video length in seconds
   */
  length_in_seconds?: number | null;
  /**
   * Array of audio languages available in the stream.
   */
  audio_languages?: Array<string>;
  /**
   * Array of subtitle languages available in the stream.
   */
  subtitle_languages?: Array<string>;
  /**
   * Array of caption languages available in the stream.
   */
  caption_languages?: Array<string>;
  /**
   * URI to a DASH manifest.
   */
  dash_manifest?: string | null;
  /**
   * URI to an HLS manifest.
   */
  hls_manifest?: string | null;
  /**
   * Video Streams
   */
  video_streams?: Array<VideoStream>;
  /**
   * Cue points associated with video.
   */
  cue_points?: Array<CuePoint>;
  /**
   * Indicates whether a stream is protected with DRM.
   */
  is_protected: boolean;
  /**
   * Output format of the stream.
   */
  output_format: Format;
}