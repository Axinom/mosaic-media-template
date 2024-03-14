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
  title: string;
  /**
   * The localized description of this movie.
   */
  description?: string | null;
  /**
   * The localized synopsis of this movie.
   */
  synopsis?: string | null;
}