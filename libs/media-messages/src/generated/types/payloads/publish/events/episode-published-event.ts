import { EpisodeLocalization } from '../types/episode-localization';
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
   * Original title of the episode.
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
   * Cast of the episode.
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
   * Sorted array of genre IDs assigned to an episode.
   */
  genre_ids: string[];
  /**
   * Array of video streams associated with movie or episode.
   */
  videos: Video[];
  /**
   * Localizations for every defined locale.
   */
  localizations: EpisodeLocalization[];
}