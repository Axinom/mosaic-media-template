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
   * The position of the movies/episodes credits in the format 'HH:MM:SS'.
   */
  credits_start_time?: string;
  /**
   * Video length in seconds.
   */
  length_in_seconds?: number | null;
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
  /**
   * Localizations for every defined locale.
   */
  localizations: MovieLocalization[];
}