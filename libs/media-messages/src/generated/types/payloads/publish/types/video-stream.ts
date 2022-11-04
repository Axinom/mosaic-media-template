import { Format } from './format';
/**
 * Video stream metadata
 */
export interface VideoStream {
  /**
   * DRM Key ID
   */
  drm_key_id?: string;
  /**
   * Label indicating the type of stream
   */
  label?: string;
  /**
   * Packaging format of the stream
   */
  format?: Format;
  /**
   * Name of the initial file
   */
  initial_file?: string;
  /**
   * IV
   */
  iv?: string;
  /**
   * If an audio file, the language code of the audio
   */
  language_code?: string;
  /**
   * Bandwidth of the video/audio
   */
  bandwidth_in_bps?: number;
}