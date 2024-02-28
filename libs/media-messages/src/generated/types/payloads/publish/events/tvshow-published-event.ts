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
   * A string with at least one character and not only whitespace characters.
   */
  title: string;
  /**
   * Original title of the TV show.
   */
  original_title?: string;
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
   * Release date of an item.
   */
  released?: string;
  /**
   * Cast of the TV show.
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
   * Sorted array of genre IDs assigned to a TV show.
   */
  genre_ids: string[];
  /**
   * Array of video streams associated with tv show or season.
   */
  videos: Video[];
  /**
   * Array of audio languages available in the stream.
   */
  audio_languages?: string[];
  /**
   * Array of subtitle languages available in the stream.
   */
  subtitle_languages?: string[];
  /**
   * Array of caption languages available in the stream.
   */
  caption_languages?: string[];
  /**
   * Directors of the media.
   */
  directors?: string[];
  /**
   * The business type of this item. It could be an advertisement based AVOD type or a premium SVOD item type.
   */
  business_type?: string;
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