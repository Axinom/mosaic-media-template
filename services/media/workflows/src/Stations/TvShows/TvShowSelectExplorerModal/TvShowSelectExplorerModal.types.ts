import { TvShowSelectionExplorerProps } from '../TvShowExplorerBase/TvShowExplorer.types';

export interface UseTvShowSelectExplorerModalOptions {
  title?: string;
  excludeItems?: number[];
  onSelection: TvShowSelectionExplorerProps['onSelection'];
}
