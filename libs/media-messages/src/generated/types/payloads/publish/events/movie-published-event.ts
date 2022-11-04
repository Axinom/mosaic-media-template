import { Image } from '../types/image';
import { License } from '../types/license';
import { Video } from '../types/video';
/**
 * Definition of the movie publish format.
 */
export interface MoviePublishedEvent {
  /**
   * Content ID of a movie. Must match the pattern`^(movie)-([a-zA-Z0-9_-]+)$.`
   */
  content_id: string;
  /**
   * Title of the movie.
   */
  title: string;
  /**
   * Original title of the movie.
   */
  original_title?: string;
  /**
   * Short description of the main plot elements.
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
   * Cast of the movie.
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
   * Sorted array of genre IDs assigned to a movie.
   */
  genre_ids: Array<string>;
  /**
   * Array of video streams associated with movie or episode.
   */
  videos: Array<Video>;
}