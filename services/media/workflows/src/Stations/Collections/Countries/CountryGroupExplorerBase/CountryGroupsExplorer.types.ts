import {
  NavigationExplorerProps,
  SelectionExplorerProps,
} from '@axinom/mosaic-ui';
import { CountryGroupsQuery } from '../../../../generated/graphql';

export type CountryGroupData = NonNullable<
  CountryGroupsQuery['filtered']
>['nodes'][number];

interface Props {
  excludeItems?: CountryGroupData['id'][];
}

export interface CountryGroupSelectionExplorerProps
  extends Omit<
      SelectionExplorerProps<CountryGroupData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'SelectionExplorer';
}

export interface CountryGroupNavigationExplorerProps
  extends Omit<
      NavigationExplorerProps<CountryGroupData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'NavigationExplorer';
}

export type CountryGroupExplorerProps =
  | CountryGroupSelectionExplorerProps
  | CountryGroupNavigationExplorerProps;
