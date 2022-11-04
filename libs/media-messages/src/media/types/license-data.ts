export interface LicenseData {
  start?: string;
  end?: string;
  /**
   * This property represents an array of 3-letter codes, all letters are upper case. Exact values are defined on database level.
   */
  countries?: string[];
}
