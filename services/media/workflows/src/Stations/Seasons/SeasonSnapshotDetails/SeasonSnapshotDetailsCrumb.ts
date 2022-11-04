import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { EntityType } from '../../../generated/graphql';
import { SnapshotDetailsCrumb } from '../../Publishing/PublishingSnapshotDetails/PublishingSnapshotDetails';

export const SeasonSnapshotDetailsCrumb: BreadcrumbResolver = (params) => {
  return SnapshotDetailsCrumb(EntityType.Season, params, 'snapshotId');
};
