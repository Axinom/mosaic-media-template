import { ColumnRenderer } from '@axinom/mosaic-ui';
import { Season } from '../../../../generated/graphql';
import { EpisodeData } from '../EpisodeExplorer.types';

export const ExplorerParentRenderer: ColumnRenderer<EpisodeData> = (
  val: unknown,
): string => {
  if (val) {
    const season = val as Pick<Season, 'id' | 'index' | 'tvshow'>;

    if (season?.tvshow) {
      return `S${season.index}: ${season.tvshow.title}`;
    }

    return `S${season.index}`;
  }

  return '';
};
