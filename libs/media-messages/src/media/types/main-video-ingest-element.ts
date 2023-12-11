import { VideoIngestData } from './video-ingest-data';

export interface MainVideoIngestElement {
  main_video?: VideoIngestData | Record<string, unknown>;
}
