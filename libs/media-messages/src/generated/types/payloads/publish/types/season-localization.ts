export interface SeasonLocalization {
  /**
   * Boolean flag to indicate if locale is default or not.
   */
  is_default_locale: boolean;
  /**
   * The locale for which the values are localized.
   */
  language_tag: string;
  /**
   * The localized title of this season.
   */
  title?: string | null;
  /**
   * The localized description of this season.
   */
  description?: string | null;
  /**
   * The localized synopsis of this season.
   */
  synopsis?: string | null;
  /**
   * Localized 1x1 cover image ID.
   */
  season_cover_1x1?: string | null;
  /**
   * Localized 16x9 cover image ID.
   */
  season_cover_16x9?: string | null;
  /**
   * Localized 1x1 clean cover image ID.
   */
  season_clean_cover_1x1?: string | null;
  /**
   * Localized 16x9 clean cover image ID.
   */
  season_clean_cover_16x9?: string | null;
  /**
   * Localized 1x1 list image ID.
   */
  season_list_1x1?: string | null;
  /**
   * Localized 9x13 list image ID.
   */
  season_list_9x13?: string | null;
}