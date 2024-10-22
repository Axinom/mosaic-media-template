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
   * Alternative text for the image.
   */
  alt_text?: string | null;
}