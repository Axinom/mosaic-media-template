import { SnapshotsQuery } from '../../../generated/graphql';

export type SnapshotData = NonNullable<
  SnapshotsQuery['filtered']
>['nodes'][number];
