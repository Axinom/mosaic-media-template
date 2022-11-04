import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { EntityType } from '../../../generated/graphql';
import { SnapshotDetailsCrumb } from '../../Publishing/PublishingSnapshotDetails/PublishingSnapshotDetails';

export const TvShowSnapshotDetailsCrumb: BreadcrumbResolver = (params) => {
  return SnapshotDetailsCrumb(EntityType.Tvshow, params, 'snapshotId');
};
