import { IngestMessageContext } from './ingest-message-context';

export interface ImageMessageContext extends IngestMessageContext {
  imageType: 'COVER' | 'TEASER';
}
