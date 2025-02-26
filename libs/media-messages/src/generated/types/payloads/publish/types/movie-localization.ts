export interface MovieLocalization {
  /**
   * Boolean flag to indicate if locale is default or not.
   */
  is_default_locale: boolean;
  /**
   * The locale for which the values are localized.
   */
  language_tag: string;
  /**
   * The localized title of this movie.
   */
  title?: string | null;
  /**
   * The localized description of this movie.
   */
  description?: string | null;
  /**
   * The localized synopsis of this movie.
   */
  synopsis?: string | null;
  /**
   * Localized cover image ID.
   */
  movie_cover?: string | null;
  /**
   * Localized 1x1 cover image ID.
   */
  movie_cover_1x1?: string | null;
  /**
   * Localized 16x9 cover image ID.
   */
  movie_cover_16x9?: string | null;
  /**
   * Localized clean cover image ID.
   */
  movie_clean_cover?: string | null;
  /**
   * Localized 1x1 clean cover image ID.
   */
  movie_clean_cover_1x1?: string | null;
  /**
   * Localized 16x9 clean cover image ID.
   */
  movie_clean_cover_16x9?: string | null;
  /**
   * Localized list image ID.
   */
  movie_list?: string | null;
  /**
   * Localized 1x1 list image ID.
   */
  movie_list_1x1?: string | null;
  /**
   * Localized 9x13 list image ID.
   */
  movie_list_9x13?: string | null;
}