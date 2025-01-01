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
                sortOrder:
                  sortOrder >
                  (item?.collectionRelations?.nodes[0]?.sortOrder ?? 0) + 1
                    ? sortOrder
                    : (item?.collectionRelations?.nodes[0]?.sortOrder ?? 0) + 1,
                entityId: item.id,
              });
            });
          }
        }
      },
    }),
  },
];
