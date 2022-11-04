import { IImagesIngestElement } from './images-ingest-element';
import { LicenseData } from './license-data';
import { IMainVideoIngestElement } from './main-video-ingest-element';
import { ITrailersIngestElement } from './trailers-ingest-element';

export interface MovieIngestData
  extends IMainVideoIngestElement,
    ITrailersIngestElement,
    IImagesIngestElement {
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
