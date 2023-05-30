import { IngestMessageContext } from './ingest-message-context';
import { VideoType } from './video-type';

export interface VideoMessageContext extends IngestMessageContext {
  videoType: VideoType;
}
