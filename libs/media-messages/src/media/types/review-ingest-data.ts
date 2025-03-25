import { LocalizationsIngestElement } from './localizations-ingest-element';

export interface ReviewIngestData extends LocalizationsIngestElement {
  title?: string;
  description?: string;
  rating?: number;
}
