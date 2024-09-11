import {
  NavigationExplorerProps,
  SelectionExplorerProps,
} from '@axinom/mosaic-ui';
import { LanguagesQuery } from '../../../../generated/graphql';

export type LanguageData = NonNullable<
  LanguagesQuery['filtered']
>['nodes'][number];

interface Props {
  excludeItems?: LanguageData['id'][];
}

export interface LanguageSelectionExplorerProps
  extends Omit<
      SelectionExplorerProps<LanguageData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'SelectionExplorer';
}

export interface LanguageNavigationExplorerProps
  extends Omit<
      NavigationExplorerProps<LanguageData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'NavigationExplorer';
}

export type LanguageExplorerProps =
  | LanguageSelectionExplorerProps
  | LanguageNavigationExplorerProps;
