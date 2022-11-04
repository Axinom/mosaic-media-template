import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { EntityType } from '../../../generated/graphql';
import { SnapshotDetailsCrumb } from '../../Publishing/PublishingSnapshotDetails/PublishingSnapshotDetails';

export const CollectionSnapshotDetailsCrumb: BreadcrumbResolver = (params) => {
  return SnapshotDetailsCrumb(EntityType.Collection, params, 'snapshotId');
};
