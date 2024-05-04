import {
  Mutations as M,
  Queries as Q,
  Subscriptions as S,
} from '../generated/graphql/operations';
export const PublishingIgnoreOperations = [Q.snapshotValidationResult];

export const SnapshotsReadOperations = [
  Q.snapshot,
  Q.snapshots,
  'snapshotValidationResults', // Required to allow requesting this as a child property of a collection. It is excluded from the root Query via smart tags.
  S.snapshotMutated,
];
export const SnapshotsMutateOperations = [
  M.publishSnapshot,
  M.publishSnapshots,
  M.recreateSnapshots,
  M.unpublishSnapshot,
  M.unpublishSnapshots,
  M.deleteSnapshot,
  M.deleteSnapshots,
];
