import {
  NavigationExplorerProps,
  SelectionExplorerProps,
} from '@axinom/mosaic-ui';
import { MoviesQuery } from '../../../generated/graphql';

export type MovieData = NonNullable<MoviesQuery['filtered']>['nodes'][number];

interface Props {
  excludeItems?: MovieData['id'][];
}

export interface MovieSelectionExplorerProps
  extends Omit<
      SelectionExplorerProps<MovieData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'SelectionExplorer';
}

export interface MovieNavigationExplorerProps
  extends Omit<
      NavigationExplorerProps<MovieData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'NavigationExplorer';
}

export type MovieExplorerProps =
  | MovieSelectionExplorerProps
  | MovieNavigationExplorerProps;
