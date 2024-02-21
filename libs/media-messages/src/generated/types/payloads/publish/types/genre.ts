/**
 * An individual TV show genre object.
 */
export interface Genre {
  /**
   * Content ID of a TV show genre. Must match the pattern `^(tvshow_genre)-([a-zA-Z0-9_-]+)$`.
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
}