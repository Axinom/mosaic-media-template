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
   * The localized description of this season.
   */
  description?: string | null;
  /**
   * The localized synopsis of this season.
   */
  synopsis?: string | null;
}