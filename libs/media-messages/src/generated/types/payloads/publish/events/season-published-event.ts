import { Image } from '../types/image';
import { License } from '../types/license';
import { SeasonLocalization } from '../types/season-localization';
import { Video } from '../types/video';
/**
 * Definition of the TV show season publish format.
 */
export interface SeasonPublishedEvent {
  /**
   * Content ID of a TV show season. Must match the pattern `^(season)-([a-zA-Z0-9_-]+)$`.
   */
  content_id: string;
  /**
   * Content ID of a TV show. Must match the pattern `^(tvshow)-([a-zA-Z0-9_-]+)$`.
   */
  tvshow_id?: string;
  /**
   * Season number
   */
  index: number;
  /**
   * Name of the producing studio.
   */
  studio?: string;
  /**
   * Release date of an item.
   */
  released?: string;
  /**
   * Cast of the season.
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
   * Sorted array of genre IDs assigned to a season.
   */
  genre_ids: string[];
  /**
   * Array of video streams associated with tv show or season.
   */
  videos: Video[];
  /**
   * Localizations for every defined locale.
   */
  localizations: SeasonLocalization[];
}