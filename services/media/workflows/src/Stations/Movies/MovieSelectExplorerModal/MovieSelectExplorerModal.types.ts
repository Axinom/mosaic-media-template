import { MovieSelectionExplorerProps } from '../MovieExplorerBase/MovieExplorer.types';

export interface UseMovieSelectExplorerModalOptions {
  title?: string;
  excludeItems?: number[];
  onSelection: MovieSelectionExplorerProps['onSelection'];
}
