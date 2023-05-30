import { IngestItem } from './ingest-item';

export interface IngestDocument {
  name: string;
  document_created?: string;
  items: IngestItem[];
}
