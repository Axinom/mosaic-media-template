import { IngestMessageContext } from './ingest-message-context';

export interface ImageLocalizationMessageContext extends IngestMessageContext {
  isImageLocalization: boolean;
  ingestItemStepIds: string[];
}
