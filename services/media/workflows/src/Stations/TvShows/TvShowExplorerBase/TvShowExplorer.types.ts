import {
  NavigationExplorerProps,
  SelectionExplorerProps,
} from '@axinom/mosaic-ui';
import { TvShowsQuery } from '../../../generated/graphql';

export type TvShowData = NonNullable<TvShowsQuery['filtered']>['nodes'][number];

interface Props {
  excludeItems?: TvShowData['id'][];
}

export interface TvShowSelectionExplorerProps
  extends Omit<
      SelectionExplorerProps<TvShowData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'SelectionExplorer';
}

export interface TvShowNavigationExplorerProps
  extends Omit<
      NavigationExplorerProps<TvShowData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'NavigationExplorer';
}

export type TvShowExplorerProps =
  | TvShowSelectionExplorerProps
  | TvShowNavigationExplorerProps;
