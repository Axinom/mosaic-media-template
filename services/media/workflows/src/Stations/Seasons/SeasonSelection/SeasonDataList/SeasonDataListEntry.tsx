import {
  ButtonContext,
  DynamicListDataEntry,
  DynamicListDataEntryProps,
} from '@axinom/mosaic-ui';
import React, { useMemo } from 'react';
import { SeasonData } from '../../SeasonExplorerBase/SeasonExplorer.types';
import { useSeasonSelectExplorerModal } from '../SeasonSelectExplorerModal/SeasonSelectExplorerModal';

interface UseSeasonDataListDataEntryOptions {
  excludeItems: SeasonData[];
}

interface UseSeasonDataListDataEntryResult {
  SeasonDataListDataEntry: React.FC<DynamicListDataEntryProps<SeasonData>>;
}

export const useSeasonDataListDataEntry = (
  options: UseSeasonDataListDataEntryOptions,
): UseSeasonDataListDataEntryResult => {
  const SeasonDataListDataEntry: React.FC<
    DynamicListDataEntryProps<SeasonData>
  > = useMemo(() => {
    const SeasonDataListDataEntry: React.FC<
      DynamicListDataEntryProps<SeasonData>
    > = (props) => {
      const { onActionClicked, ...rest } = props;

      const {
        ModalWrapper: SeasonSelectExplorerModal,
        openModal,
        closeModal,
      } = useSeasonSelectExplorerModal({
        excludeItems: options.excludeItems.map((item) => item.id),
        onSelection: (selection) => {
          if (selection.mode === 'SINGLE_ITEMS') {
            const items = selection.items;
            if (items && onActionClicked) {
              items.forEach((item) => onActionClicked(item));
            }
          }
          closeModal();
        },
      });

      return (
        <>
          <DynamicListDataEntry
            onActionClicked={() => openModal()}
            {...rest}
            actionButtonContext={ButtonContext.Active}
          />
          <SeasonSelectExplorerModal />
        </>
      );
    };

    return SeasonDataListDataEntry;
  }, [options.excludeItems]);

  return { SeasonDataListDataEntry };
};
