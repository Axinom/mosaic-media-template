export interface EpisodeLocalization {
  /**
   * Boolean flag to indicate if locale is default or not.
   */
  is_default_locale: boolean;
  /**
   * The locale for which the values are localized.
   */
  language_tag: string;
  /**
   * The localized title of this episode.
   */
  title: string;
  /**
   * The localized description of this episode.
   */
  description?: string | null;
  /**
   * The localized synopsis of this episode.
   */
  synopsis?: string | null;
}