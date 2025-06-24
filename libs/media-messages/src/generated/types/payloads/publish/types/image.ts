import { ImageType } from './image-type';
/**
 * Asset image metadata.
 */
export interface Image {
  /**
   * Type of the image.
   */
  type: ImageType;
  /**
   * URI to the image file.
   */
  path: string;
  /**
   * Width of the image in pixels.
   */
  width?: number | null;
  /**
   * Height of the image in pixels.
   */
  height?: number | null;
  /**
   * Language tag for the image if the image is localized.
   */
  language_tag?: string | null;
}