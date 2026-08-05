import { SeasonSelectionExplorerProps } from '../../SeasonExplorerBase/SeasonExplorer.types';

export interface UseSeasonSelectExplorerModalOptions {
  title?: string;
  excludeItems?: number[];
  allowBulkSelect?: boolean;
  onSelection: SeasonSelectionExplorerProps['onSelection'];
}
