import {
  ButtonContext,
  DynamicListDataEntry,
  DynamicListDataEntryProps,
} from '@axinom/mosaic-ui';
import React, { useMemo } from 'react';
import { useSeasonSelectExplorerModal } from '../../../Seasons/SeasonSelectExplorerModal/SeasonSelectExplorerModal';
import { TvShowSeason } from '../TvShowSeasonManagement.types';

interface UseSeasonDataListDataEntryOptions {
  excludeItems: TvShowSeason[];
}

interface UseSeasonDataListDataEntryResult {
  SeasonDataListDataEntry: React.FC<DynamicListDataEntryProps<TvShowSeason>>;
}

export const useSeasonDataListDataEntry = (
  options: UseSeasonDataListDataEntryOptions,
): UseSeasonDataListDataEntryResult => {
  const SeasonDataListDataEntry: React.FC<DynamicListDataEntryProps<
    TvShowSeason
  >> = useMemo(() => {
    const SeasonDataListDataEntry: React.FC<DynamicListDataEntryProps<
      TvShowSeason
    >> = (props) => {
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
