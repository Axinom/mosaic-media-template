import { TvShowSelectionExplorerProps } from '../../TvShowExplorerBase/TvShowExplorer.types';

export interface UseTvShowSelectExplorerModalOptions {
  title?: string;
  excludeItems?: number[];
  allowBulkSelect?: boolean;
  onSelection: TvShowSelectionExplorerProps['onSelection'];
}
