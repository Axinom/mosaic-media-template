/**
 * Content metadata license that defines the content availability regions and time frame.
 */
export interface License {
  /**
   * Array of countries where the license applies.
   */
  countries?: string[];
  /**
   * Time when license becomes valid.
   */
  start_time?: string;
  /**
   * Time when license becomes invalid.
   */
  end_time?: string;
}