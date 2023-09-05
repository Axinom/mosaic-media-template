export interface CollectionLocalization {
  /**
   * Boolean flag to indicate if locale is default or not.
   */
  is_default_locale: boolean;
  /**
   * The locale for which the values are localized.
   */
  language_tag: string;
  /**
   * The localized title of this collection.
   */
  title: string;
  /**
   * The localized description of this collection.
   */
  description?: string | null;
  /**
   * The localized synopsis of this collection.
   */
  synopsis?: string | null;
}