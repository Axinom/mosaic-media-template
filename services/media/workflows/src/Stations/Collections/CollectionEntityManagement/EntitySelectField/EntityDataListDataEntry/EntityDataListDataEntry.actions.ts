import { EntityType } from '../../../../../generated/graphql';
import { useEpisodeSelectExplorerModal } from '../../../../Episodes/EpisodeSelectExplorerModal/EpisodeSelectExplorerModal';
import { useMovieSelectExplorerModal } from '../../../../Movies/MovieSelectExplorerModal/MovieSelectExplorerModal';
import { useTvShowSelectExplorerModal } from '../../../../TvShows/TvShowSelectExplorerModal/TvShowSelectExplorerModal';
import { useCollectionSelectExplorerModal } from '../../../CollectionSelectExplorerModal/CollectionSelectExplorerModal';
import { UseAddOptionsResult } from './EntityDataListDataEntry.types';

export const useAddOptions: UseAddOptionsResult = (
  onActionClicked,
  excludes,
  _sortOrder,
) => [
  {
    title: 'Add Movie',
    ...useMovieSelectExplorerModal({
      excludeItems: excludes[EntityType.Movie],
      onSelection: (selection) => {
        if (selection.mode === 'SINGLE_ITEMS') {
          const items = selection.items;
          if (items && onActionClicked) {
            items.forEach((item, _index) => {
              onActionClicked({
                entityType: EntityType.Movie,
                entityImages: item.moviesImages,
                entityLicenses: item.moviesLicenses,
                publishStatus: item.publishStatus,
                title: item.title,
                sortOrder: 1,
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
            items.forEach((item, _index) => {
              onActionClicked({
                entityType: EntityType.Tvshow,
                entityImages: item.tvshowsImages,
                entityLicenses: item.tvshowsLicenses,
                publishStatus: item.publishStatus,
                title: item.title,
                sortOrder: 1,
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
            items.forEach((item, _index) => {
              onActionClicked({
                entityType: EntityType.Episode,
                entityImages: item.episodesImages,
                entityLicenses: item.episodesLicenses,
                publishStatus: item.publishStatus,
                title: item.title,
                sortOrder: 1,
                entityId: item.id,
              });
            });
          }
        }
      },
    }),
  },
  {
    title: 'Add Collection',
    ...useCollectionSelectExplorerModal({
      excludeItems: excludes[EntityType.Collection],
      onSelection: (selection) => {
        if (selection.mode === 'SINGLE_ITEMS') {
          const items = selection.items;
          if (items && onActionClicked) {
            items.forEach((item, _index) => {
              onActionClicked({
                entityType: EntityType.Collection,
                entityImages: item.collectionsImages,
                publishStatus: item.publishStatus,
                title: item.title,
                sortOrder: 1,
                entityId: item.id,
              });
            });
          }
        }
      },
    }),
  },
];
