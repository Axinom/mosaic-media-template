import { ColumnRenderer } from '@axinom/mosaic-ui';
import { EpisodeData } from '../EpisodeExplorer.types';

export const ExplorerIndexRenderer: ColumnRenderer<EpisodeData> = (
  val: unknown,
): string => {
  if (typeof val === 'number') {
    return `E${String(val)}`;
  }

  return '';
};
