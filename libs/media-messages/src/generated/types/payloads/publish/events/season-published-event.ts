import { Image } from '../types/image';
import { License } from '../types/license';
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
   * A string with at least one character and not only whitespace characters.
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
   * A string with at least one character and not only whitespace characters.
   */
  title?: string;
  /**
   * Original title of the season.
   */
  original_title?: string;
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
   * Directors of the media.
   */
  directors?: string[];
  /**
   * Dynamic field.
   */
  dynamic_field?: string;
  /**
   * List of extended properties (key/value pairs) for an asset. These properties are not used by MS and are simply passed through to the response models.
   */
  extended_field?: string;
  /**
   * Custom rating.
   */
  custom_rating?: string;
  /**
   * The rating of the item.
   */
  rating?: number;
  /**
   * Age rating for parental ratings.
   */
  age_rating?: string;
  /**
   * Asset type.
   */
  asset_type?: number;
  /**
   * Optional asset subtype.
   */
  asset_subtype?: string;
}