import {
  Mutations as M,
  Queries as Q,
  Subscriptions as S,
} from '../generated/graphql/operations';

export const IngestReadOperations = [
  Q.ingestDocument,
  Q.ingestDocuments,
  Q.ingestItem,
  Q.ingestItems,
  Q.ingestItemStep,
  Q.ingestItemSteps,
  S.ingestDocumentMutated,
];

export const IngestMutateOperations = [M.startIngest, M.updateIngestDocument];
