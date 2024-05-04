import { ColumnRenderer } from '@axinom/mosaic-ui';
import { Tvshow } from '../../../../generated/graphql';
import { SeasonData } from '../SeasonExplorer.types';

export const SeasonParentRenderer: ColumnRenderer<SeasonData> = (
  val: unknown,
): string => {
  if (val) {
    const tvshow = val as Pick<Tvshow, 'id' | 'title'>;

    if (tvshow?.title) {
      return tvshow?.title;
    }
  }

  return '';
};
