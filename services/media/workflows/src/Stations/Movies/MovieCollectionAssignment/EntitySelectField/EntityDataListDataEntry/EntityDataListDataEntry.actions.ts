import { EntityType } from '../../../../../generated/graphql';
import { useCollectionSelectExplorerModal } from '../../../../Collections/CollectionSelectExplorerModal/CollectionSelectExplorerModal';
import { UseAddOptionsResult } from './EntityDataListDataEntry.types';

export const useAddOptions: UseAddOptionsResult = (
  onActionClicked,
  excludes,
  sortOrder,
) => [
  {
    title: 'Add Collection',
    ...useCollectionSelectExplorerModal({
      excludeItems: excludes[EntityType.Movie],
      onSelection: (selection) => {
        if (selection.mode === 'SINGLE_ITEMS') {
          const items = selection.items;
          if (items && onActionClicked) {
            // items.forEach((item, index) => {
            //   onActionClicked({
            //     entityType: EntityType.Movie,
            //     entityImages: item.moviesImages,
            //     publishStatus: item.publishStatus,
            //     title: item.title,
            //     sortOrder: sortOrder + index,
            //     entityId: item.id,
            //   });
            // });
          }
        }
      },
    }),
  },
];
