import { ImagesIngestElement } from './images-ingest-element';
import { LocalizationsIngestElement } from './localizations-ingest-element';

export interface CollectionEntityElement {
  sort_order: number;
  external_id: string;
  type: 'MOVIE' | 'TVSHOW' | 'EPISODE' | 'COLLECTION';
}

export interface CollectionIngestData
  extends ImagesIngestElement,
    LocalizationsIngestElement {
  title?: string;
  description?: string;
  synopsis?: string;
  tags?: string[];
  production_countries?: string[];
  custom?: string;
  entities?: CollectionEntityElement[];
}
