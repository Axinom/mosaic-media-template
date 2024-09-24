import { CollectionSelectionExplorerProps } from '../CollectionsExplorer/Collections.types';

export interface UseCollectionSelectExplorerModalOptions {
  title?: string;
  excludeItems?: number[];
  onSelection: CollectionSelectionExplorerProps['onSelection'];
}
