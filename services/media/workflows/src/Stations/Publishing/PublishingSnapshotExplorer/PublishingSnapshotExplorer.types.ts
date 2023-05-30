import { NavigationExplorerProps } from '@axinom/mosaic-ui';
import {
  EntityType,
  PublishingSnapshotsQuery,
} from '../../../generated/graphql';

export type SnapshotData = NonNullable<
  PublishingSnapshotsQuery['filtered']
>['nodes'][number];

export interface PublishingSnapshotExplorerProps
  extends Omit<
    NavigationExplorerProps<SnapshotData>,
    'columns' | 'dataProvider' | 'filterOptions' | 'bulkActions'
  > {
  entityType: EntityType;
  entityId?: number;
}
