import { Image } from '../types/image';
import { License } from '../types/license';
import { MovieLocalization } from '../types/movie-localization';
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
   * Original title of the movie.
   */
  original_title?: string;
  /**
   * Name of the producing studio.
   */
  studio?: string;
  /**
   * Release date of an item.
   */
  released?: string;
  /**
   * Cast of the movie.
   */
  cast?: string[];
  /**
   * Array of production countries
   */
  production_countries?: string[];
  /**
   * Array of tags associated with the content.
   */
  tags?: string[];
  /**
   * Array of images associated with the content.
   */
  images: Image[];
  /**
   * Array of licenses assigned to the content.
   */
  licenses: License[];
  /**
   * Sorted array of genre IDs assigned to a movie.
   */
  genre_ids: string[];
  /**
   * Array of video streams associated with movie or episode.
   */
  videos: Video[];
  /**
   * Localizations for every defined locale.
   */
  localizations: MovieLocalization[];
}