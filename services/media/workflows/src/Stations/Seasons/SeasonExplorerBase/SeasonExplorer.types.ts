import {
  NavigationExplorerProps,
  SelectionExplorerProps,
} from '@axinom/mosaic-ui';
import { SeasonsQuery } from '../../../generated/graphql';

export type SeasonData = NonNullable<SeasonsQuery['filtered']>['nodes'][number];

interface Props {
  excludeItems?: SeasonData['id'][];
}

export interface SeasonSelectionExplorerProps
  extends Omit<
      SelectionExplorerProps<SeasonData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'SelectionExplorer';
}

export interface SeasonNavigationExplorerProps
  extends Omit<
      NavigationExplorerProps<SeasonData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'NavigationExplorer';
}

export type SeasonExplorerProps =
  | SeasonSelectionExplorerProps
  | SeasonNavigationExplorerProps;
