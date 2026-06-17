export interface VideoIngestData {
  source: string;
  /** @deprecated Use processing_profile instead */
  profile?: string;
  processing_profile?: string;
  acquisition_profile?: string;
  publishing_profile?: string;
}
