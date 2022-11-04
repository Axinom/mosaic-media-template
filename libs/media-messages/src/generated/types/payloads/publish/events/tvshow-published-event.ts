import { Image } from '../types/image';
import { License } from '../types/license';
import { Video } from '../types/video';
/**
 * Definition of the TV show publish format.
 */
export interface TvshowPublishedEvent {
  /**
   * Content ID of a TV show. Must match the pattern `^(tvshow)-([a-zA-Z0-9_-]+)$`.
   */
  content_id: string;
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
   */
  title: string;
  /**
   * Original title of the TV show.
   */
  original_title?: string;
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
   */
  synopsis?: string;
  /**
   * Extended synopsis.
   */
  description?: string;
  /**
   * Name of the producing studio.
   */
  studio?: string;
  /**
   * Date of first release.
   */
  released?: string;
  /**
   * Cast of the TV show.
   */
  cast?: Array<string>;
  /**
   * Array of production countries
   */
  production_countries?: Array<string>;
  /**
   * Array of tags associated with the content.
   */
  tags?: Array<string>;
  /**
   * Array of images associated with the content.
   */
  images: Array<Image>;
  /**
   * Array of licenses assigned to the content.
   */
  licenses: Array<License>;
  /**
   * Sorted array of genre IDs assigned to a TV show.
   */
  genre_ids: Array<string>;
  /**
   * Array of video streams associated with tv show or season.
   */
  videos: Array<Video>;
}