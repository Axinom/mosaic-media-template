import { ImagesIngestElement } from './images-ingest-element';
import { LicenseData } from './license-data';
import { LocalizationsIngestElement } from './localizations-ingest-element';
import { MainVideoIngestElement } from './main-video-ingest-element';
import { TrailersIngestElement } from './trailers-ingest-element';

export interface MovieIngestData
  extends MainVideoIngestElement,
    TrailersIngestElement,
    ImagesIngestElement,
    LocalizationsIngestElement {
  title?: string;
  description?: string;
  original_title?: string;
  released?: string;
  studio?: string;
  synopsis?: string;
  tags?: string[];
  cast?: string[];
  production_countries?: string[];
  genres?: string[];
  licenses?: LicenseData[];
}
