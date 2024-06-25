/**
 * Image details.
 */
export interface DetailedImage {
  /**
   * A UUID.
   */
  id: string;
  /**
   * Type of the image.
   */
  type: string;
  /**
   * URI to the image file.
   */
  path: string;
  /**
   * Width of the image.
   */
  width?: number | null;
  /**
   * Height of the image.
   */
  height?: number | null;

  [k: string]: unknown;
}