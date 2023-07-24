import { ColumnRenderer } from '@axinom/mosaic-ui';
import { SeasonData } from '../SeasonExplorer.types';

export const SeasonIndexRenderer: ColumnRenderer<SeasonData> = (
  val: unknown,
): string => {
  if (typeof val === 'number') {
    return `S${String(val)}`;
  }

  return '';
};
