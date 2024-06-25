import { ColumnMap } from '@axinom/mosaic-ui';
import { PublicationState } from '../../generated/graphql';

export const publicationStateMap: ColumnMap = {
  [PublicationState.NotPublished]: '#DDDDDD',
  [PublicationState.Changed]: '#FFC81A',
  [PublicationState.Published]: '#95C842',
};
