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
   * Array of tags associated with the content.
   */
  tags?: string[];
  /**
   * Array of images associated with the content.
   */
  images?: Image[];
  /**
   * Array of content related items metadata.
   */
  related_items: RelatedItem[];
  /**
   * Localizations for every defined locale.
   */
  localizations: CollectionLocalization[];
}