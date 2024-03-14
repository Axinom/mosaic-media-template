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
   * Content ID of a TV show. Must match the pattern `^(tvshow)-([a-zA-Z0-9_-]+)$`.
   */
  tvshow_id?: string;
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
   * Directors of the media.
   */
  directors?: string[];
  /**
   * The position of the movies/episodes credits in the format 'HH:MM:SS'.
   */
  credits_start_time?: string;
  /**
   * The position of the episode intro start in the format 'HH:MM:SS'.
   */
  intro_start_time?: string;
  /**
   * The position of the episode intro end in the format 'HH:MM:SS'.
   */
  intro_end_time?: string;
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
  localizations: EpisodeLocalization[];
}