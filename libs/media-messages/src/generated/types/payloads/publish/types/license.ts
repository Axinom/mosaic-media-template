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
  /**
   * This asset can be downloaded for later viewing.
   */
  is_downloadable?: boolean;
  /**
   * The name of the content owner.
   */
  content_owner?: string;
  /**
   * A price tier at which the asset should be available in this country.
   */
  tier?: string;
  /**
   * The business type of this item. It could be an advertisement based AVOD type or a premium SVOD item type.
   */
  business_type?: string;
  /**
   * Max duration of keeping the downloaded content.
   */
  downloaded_asset_lifespan?: number;
}