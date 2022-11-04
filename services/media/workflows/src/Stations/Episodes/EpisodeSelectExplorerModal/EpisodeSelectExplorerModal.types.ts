import { EpisodeSelectionExplorerProps } from '../EpisodeExplorerBase/EpisodeExplorer.types';

export interface UseEpisodeSelectExplorerModalOptions {
  title?: string;
  excludeItems?: number[];
  onSelection: EpisodeSelectionExplorerProps['onSelection'];
}
