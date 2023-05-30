import { EntityType } from '../../../../../generated/graphql';
import { useEpisodeSelectExplorerModal } from '../../../../Episodes/EpisodeSelectExplorerModal/EpisodeSelectExplorerModal';
import { useMovieSelectExplorerModal } from '../../../../Movies/MovieSelectExplorerModal/MovieSelectExplorerModal';
import { useSeasonSelectExplorerModal } from '../../../../Seasons/SeasonSelectExplorerModal/SeasonSelectExplorerModal';
import { useTvShowSelectExplorerModal } from '../../../../TvShows/TvShowSelectExplorerModal/TvShowSelectExplorerModal';
import { UseAddOptionsResult } from './EntityDataListDataEntry.types';

export const useAddOptions: UseAddOptionsResult = (
  onActionClicked,
  excludes,
  sortOrder,
) => [
  {
    title: 'Add Movie',
    ...useMovieSelectExplorerModal({
      excludeItems: excludes[EntityType.Movie],
      onSelection: (selection) => {
        if (selection.mode === 'SINGLE_ITEMS') {
          const items = selection.items;
          if (items && onActionClicked) {
            items.forEach((item, index) => {
              onActionClicked({
                entityType: EntityType.Movie,
                entityImages: item.moviesImages,
                publishStatus: item.publishStatus,
                title: item.title,
                sortOrder: sortOrder + index,
                entityId: item.id,
              });
            });
          }
        }
      },
    }),
  },
  {
    title: 'Add TV Show',
    ...useTvShowSelectExplorerModal({
      excludeItems: excludes[EntityType.Tvshow],
      onSelection: (selection) => {
        if (selection.mode === 'SINGLE_ITEMS') {
          const items = selection.items;
          if (items && onActionClicked) {
            items.forEach((item, index) => {
              onActionClicked({
                entityType: EntityType.Tvshow,
                entityImages: item.tvshowsImages,
                publishStatus: item.publishStatus,
                title: item.title,
                sortOrder: sortOrder + index,
                entityId: item.id,
              });
            });
          }
        }
      },
    }),
  },
  {
    title: 'Add Season',
    ...useSeasonSelectExplorerModal({
      excludeItems: excludes[EntityType.Season],
      onSelection: (selection) => {
        if (selection.mode === 'SINGLE_ITEMS') {
          const items = selection.items;
          if (items && onActionClicked) {
            items.forEach((item, index) => {
              onActionClicked({
                entityType: EntityType.Season,
                entityImages: item.seasonsImages,
                publishStatus: item.publishStatus,
                index: item.index,
                title: `Season ${item.index}`,
                sortOrder: sortOrder + index,
                entityId: item.id,
              });
            });
          }
        }
      },
    }),
  },
  {
    title: 'Add Episode',
    ...useEpisodeSelectExplorerModal({
      excludeItems: excludes[EntityType.Episode],
      onSelection: (selection) => {
        if (selection.mode === 'SINGLE_ITEMS') {
          const items = selection.items;
          if (items && onActionClicked) {
            items.forEach((item, index) => {
              onActionClicked({
                entityType: EntityType.Episode,
                entityImages: item.episodesImages,
                publishStatus: item.publishStatus,
                title: item.title,
                sortOrder: sortOrder + index,
                entityId: item.id,
              });
            });
          }
        }
      },
    }),
  },
];
