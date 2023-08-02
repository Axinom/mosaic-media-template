import { MovieGenreLocalization } from './movie-genre-localization';
/**
 * An individual movie genre object.
 */
export interface MovieGenre {
  /**
   * Content ID of a movie genre. Must match the pattern `^(movie_genre)-([a-zA-Z0-9_-]+)$`.
   */
  content_id: string;
  /**
   * A string with at least one character and not only whitespace characters.
   */
  title: string;
  /**
   * Global ordering number for the genre.
   */
  order_no: number;
  /**
   * Localizations for every defined locale.
   */
  localizations?: MovieGenreLocalization[];
}