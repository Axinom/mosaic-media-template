import {
  StartIngestItemCommand,
  UpdateMetadataCommand,
} from '../../generated/types/payloads';

export type IngestItem =
  | StartIngestItemCommand['item']
  | UpdateMetadataCommand['item'];
