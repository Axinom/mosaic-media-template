import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { EntityType } from '../../../generated/graphql';
import { SnapshotDetailsCrumb } from '../../Publishing/PublishingSnapshotDetails/PublishingSnapshotDetails';

export const EpisodeSnapshotDetailsCrumb: BreadcrumbResolver = (params) => {
  return SnapshotDetailsCrumb(EntityType.Episode, params, 'snapshotId');
};
