import {
  ButtonContext,
  DynamicListDataEntry,
  DynamicListDataEntryProps,
} from '@axinom/mosaic-ui';
import React, { useMemo } from 'react';
import { TvShowData } from '../../TvShowExplorerBase/TvShowExplorer.types';
import { useTvShowSelectExplorerModal } from '../TvShowSelectExplorerModal/TvShowSelectExplorerModal';

interface UseTvShowDataListDataEntryOptions {
  excludeItems: TvShowData[];
}

interface UseTvShowDataListDataEntryResult {
  TvShowDataListDataEntry: React.FC<DynamicListDataEntryProps<TvShowData>>;
}

export const useTvShowDataListDataEntry = (
  options: UseTvShowDataListDataEntryOptions,
): UseTvShowDataListDataEntryResult => {
  const TvShowDataListDataEntry: React.FC<
    DynamicListDataEntryProps<TvShowData>
  > = useMemo(() => {
    const TvShowDataListDataEntry: React.FC<
      DynamicListDataEntryProps<TvShowData>
    > = (props) => {
      const { onActionClicked, ...rest } = props;

      const {
        ModalWrapper: TvShowSelectExplorerModal,
        openModal,
        closeModal,
      } = useTvShowSelectExplorerModal({
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
          <TvShowSelectExplorerModal />
        </>
      );
    };

    return TvShowDataListDataEntry;
  }, [options.excludeItems]);

  return { TvShowDataListDataEntry };
};
