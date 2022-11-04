import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { EntityType } from '../../../generated/graphql';
import { SnapshotDetailsCrumb } from '../../Publishing/PublishingSnapshotDetails/PublishingSnapshotDetails';

export const MovieGenreSnapshotDetailsCrumb: BreadcrumbResolver = (params) => {
  return SnapshotDetailsCrumb(EntityType.MovieGenre, params, 'snapshotId');
};
