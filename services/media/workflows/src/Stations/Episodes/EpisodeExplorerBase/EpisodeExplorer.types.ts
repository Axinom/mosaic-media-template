import {
  NavigationExplorerProps,
  SelectionExplorerProps,
} from '@axinom/mosaic-ui';
import { EpisodesQuery } from '../../../generated/graphql';

export type EpisodeData = NonNullable<
  EpisodesQuery['filtered']
>['nodes'][number];

interface Props {
  excludeItems?: EpisodeData['id'][];
}

export interface EpisodeSelectionExplorerProps
  extends Omit<
      SelectionExplorerProps<EpisodeData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'SelectionExplorer';
}

export interface EpisodeNavigationExplorerProps
  extends Omit<
      NavigationExplorerProps<EpisodeData>,
      'columns' | 'dataProvider' | 'filterOptions'
    >,
    Props {
  /** Type Tag */
  kind: 'NavigationExplorer';
}

export type EpisodeExplorerProps =
  | EpisodeSelectionExplorerProps
  | EpisodeNavigationExplorerProps;
