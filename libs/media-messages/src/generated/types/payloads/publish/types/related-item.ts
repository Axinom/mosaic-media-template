import { RelationType } from './relation-type';
/**
 * Related item metadata.
 */
export interface RelatedItem {
  /**
   * Content ID of a movie. Must match the pattern`^(movie)-([a-zA-Z0-9_-]+)$.`
   */
  movie_id?: string;
  /**
   * Content ID of a TV show. Must match the pattern `^(tvshow)-([a-zA-Z0-9_-]+)$`.
   */
  tvshow_id?: string;
  /**
   * Content ID of a TV show season. Must match the pattern `^(season)-([a-zA-Z0-9_-]+)$`.
   */
  season_id?: string;
  /**
   * Content ID of a TV show episode. Must match the pattern `^(episode)-([a-zA-Z0-9_-]+)$`.
   */
  episode_id?: string;
  /**
   * Ordering number for the genre.
   */
  order_no: number;
  /**
   * Textual representation of relation type.
   */
  relation_type: RelationType;
}