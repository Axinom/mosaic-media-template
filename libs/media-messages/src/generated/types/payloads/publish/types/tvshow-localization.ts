export interface TvshowLocalization {
  /**
   * Boolean flag to indicate if locale is default or not.
   */
  is_default_locale: boolean;
  /**
   * The locale for which the values are localized.
   */
  language_tag: string;
  /**
   * The localized title of this TV show.
   */
  title: string;
  /**
   * The localized description of this TV show.
   */
  description?: string | null;
  /**
   * The localized synopsis of this TV show.
   */
  synopsis?: string | null;
}