import { ColumnMap } from '@axinom/mosaic-ui';
import { PublishStatus } from '../../generated/graphql';

export const PublishStatusStateMap: ColumnMap = {
  [PublishStatus.NotPublished]: '#DDDDDD',
  [PublishStatus.Changed]: '#FFC81A',
  [PublishStatus.Published]: '#95C842',
};
