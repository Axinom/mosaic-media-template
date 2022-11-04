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
   * String of minimum length of 1 character, which is also cannot consist of only whitespace characters.
   */
  title: string;
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
  tags?: Array<string>;
  /**
   * Array of images associated with the content.
   */
  images?: Array<Image>;
  /**
   * Array of content related items metadata.
   */
  related_items: Array<RelatedItem>;
}