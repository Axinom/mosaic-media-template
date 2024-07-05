export interface IngestLocalization {
  language_tag: string;

  [k: string]: unknown;
}

export interface LocalizationsIngestElement {
  localizations?: IngestLocalization[];
}
