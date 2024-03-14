import { TvshowGenreLocalization } from './tvshow-genre-localization';
/**
 * An individual TV show genre object.
 */
export interface TvshowGenre {
  /**
   * Content ID of a TV show genre. Must match the pattern `^(tvshow_genre)-([a-zA-Z0-9_-]+)$`.
   */
  content_id: string;
  /**
   * Global ordering number for the genre.
   */
  order_no: number;
  /**
   * Localizations for every defined locale.
   */
  localizations: TvshowGenreLocalization[];
}