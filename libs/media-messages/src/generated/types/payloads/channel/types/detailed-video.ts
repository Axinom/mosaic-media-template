import { Encoding } from './encoding';
/**
 * Video details to be used to enable live streaming.
 */
export interface DetailedVideo {
  /**
   * A UUID.
   */
  id: string;
  /**
   * Video title
   */
  title: string;
  /**
   * An identifier for the custom video.
   */
  custom_id: string | null;
  /**
   * Source file name
   */
  source_file_name?: string | null;
  /**
   * Source file extension
   */
  source_file_extension?: string | null;
  /**
   * Full source file name, including extension
   */
  source_full_file_name?: string | null;
  /**
   * Path to the folder in the storage that contains source video files
   */
  source_location: string;
  /**
   * Combined size of all source video files
   */
  source_size_in_bytes?: number | null;
  /**
   * Is video archived or not
   */
  is_archived: boolean;
  /**
   * An array of video tag values.
   */
  videos_tags: string[];
  /**
   * Information about specific video encoding.
   */
  video_encoding: Encoding;

  [k: string]: unknown;
}