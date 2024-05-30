import { CollectionLocalization } from '../types/collection-localization';
import { Image } from '../types/image';
import { RelatedItem } from '../types/related-item';
/**
 * Definition of the collection publish format.
 */
export interface CollectionPublishedEvent {
  /**
   * Content ID of a collection. Must match the pattern `^(collection)-([a-zA-Z0-9_-]+)$`.
   */
  content_id: string;
  /**
   * A string with at least one character and not only whitespace characters.
   */
  title?: string;
  /**
   * Original title of the season.
   */
  original_title?: string;
  /**
   * Short description.
   */
  synopsis?: string;
  /**
   * Longer description.
   */
  description?: string;
  /**
   * Array of tags associated with the content.
   */
  tags?: string[];
  /**
   * Array of images associated with the content.
   */
  images?: Image[];
  /**
   * Asset type.
   */
  asset_type?: number;
  /**
   * Dynamic field.
   */
  dynamic_field?: string;
  /**
   * List of extended properties (key/value pairs) for an asset. These properties are not used by MS and are simply passed through to the response models.
   */
  extended_field?: string;
  /**
   * The countries of the collection.
   */
  countries?: string[];
  /**
   * The languages of the collection.
   */
  languages?: string[];
  /**
   * Array of content related items metadata.
   */
  related_items: RelatedItem[];
  /**
   * Localizations for every defined locale.
   */
  localizations: CollectionLocalization[];
}