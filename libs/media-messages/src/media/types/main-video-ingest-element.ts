import { VideoIngestData } from './video-ingest-data';

export interface IMainVideoIngestElement {
  main_video?: VideoIngestData | Record<string, unknown>;
}
