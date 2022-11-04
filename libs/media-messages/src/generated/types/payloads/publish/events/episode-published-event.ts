import { Image } from '../types/image';
import { License } from '../types/license';
import { Video } from '../types/video';
/**
 * Definition of the TV show episode publish format.
 */
export interface EpisodePublishedEvent {
  /**
   * Content ID of a TV show episode. Must match the pattern `^(episode)-([a-zA-Z0-9_-]+)$`.
   */
  content_id: string;
  /**
   * Content ID of a TV show season. Must match the pattern `^(season)-([a-zA-Z0-9_-]+)$`.
   */
  season_id?: string;
  /**
   * Episode number
   */
  index: number;
  /**
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
   */
  title: string;
  /**
   * Original title of the episode.
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
   * Cast of the episode.
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
   * Sorted array of genre IDs assigned to an episode.
   */
  genre_ids: Array<string>;
  /**
   * Array of video streams associated with movie or episode.
   */
  videos: Array<Video>;
}