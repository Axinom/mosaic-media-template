import {
  NavigationExplorerProps,
  SelectionExplorerProps,
} from '@axinom/mosaic-ui';
import { CollectionsQuery } from '../../../generated/graphql';

export type CollectionData = NonNullable<
  CollectionsQuery['filtered']
>['nodes'][number];

interface Props {
  excludeItems?: CollectionData['id'][];
}

export interface CollectionSelectionExplorerProps
  extends Omit<
      SelectionExplorerProps<CollectionData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'SelectionExplorer';
}

export interface CollectionNavigationExplorerProps
  extends Omit<
      NavigationExplorerProps<CollectionData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'NavigationExplorer';
}

export type CollectionExplorerProps =
  | CollectionSelectionExplorerProps
  | CollectionNavigationExplorerProps;
