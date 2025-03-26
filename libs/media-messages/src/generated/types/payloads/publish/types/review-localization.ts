export interface ReviewLocalization {
  /**
   * Boolean flag to indicate if locale is default or not.
   */
  is_default_locale: boolean;
  /**
   * The locale for which the values are localized.
   */
  language_tag: string;
  /**
   * The localized title of this review.
   */
  title: string;
  /**
   * The localized description of this review.
   */
  description?: string | null;
}