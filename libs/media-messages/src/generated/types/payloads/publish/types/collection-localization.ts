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
  title?: string | null;
  /**
   * The localized description of this collection.
   */
  description?: string | null;
  /**
   * The localized synopsis of this collection.
   */
  synopsis?: string | null;
  /**
   * Localized cover image ID.
   */
  collection_cover?: string | null;
  /**
   * Localized 1x1 cover image ID.
   */
  collection_cover_1x1?: string | null;
  /**
   * Localized 4x1 cover image ID.
   */
  collection_cover_4x1?: string | null;
  /**
   * Localized clean cover image ID.
   */
  collection_clean_cover?: string | null;
  /**
   * Localized 1x1 clean cover image ID.
   */
  collection_clean_cover_1x1?: string | null;
  /**
   * Localized 4x1 clean cover image ID.
   */
  collection_clean_cover_4x1?: string | null;
  /**
   * Localized list image ID.
   */
  collection_list?: string | null;
  /**
   * Localized 1x1 list image ID.
   */
  collection_list_1x1?: string | null;
  /**
   * Localized 15x16 list image ID.
   */
  collection_list_15x16?: string | null;
  /**
   * The localized cover image of this movie.
   */
  cover?: string | null;
  /**
   * The localized clean_cover image cover of this movie.
   */
  clean_cover?: string | null;
  /**
   * The localized list image of this movie.
   */
  list?: string | null;
}