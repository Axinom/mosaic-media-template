import {
  NavigationExplorerProps,
  SelectionExplorerProps,
} from '@axinom/mosaic-ui';
import { CustomerQuery } from '../../../generated/graphql';

export type CustomerData = NonNullable<
  CustomerQuery['filtered']
>['customers'][number];

interface Props {
  excludeItems?: CustomerData['id'];
}

export interface CustomerSelectionExplorerProps
  extends Omit<
      SelectionExplorerProps<CustomerData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'SelectionExplorer';
}

export interface CustomerNavigationExplorerProps
  extends Omit<
      NavigationExplorerProps<CustomerData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'NavigationExplorer';
}

export type CustomerExplorerProps =
  | CustomerSelectionExplorerProps
  | CustomerNavigationExplorerProps;
