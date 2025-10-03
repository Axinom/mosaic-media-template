import {
  ButtonContext,
  DynamicListDataEntry,
  DynamicListDataEntryProps,
} from '@axinom/mosaic-ui';
import React, { useMemo } from 'react';
import { EpisodeData } from '../../EpisodeExplorerBase/EpisodeExplorer.types';
import { useEpisodeSelectExplorerModal } from '../EpisodeSelectExplorerModal/EpisodeSelectExplorerModal';

interface UseEpisodeDataListDataEntryOptions {
  excludeItems: EpisodeData[];
}

interface UseEpisodeDataListDataEntryResult {
  EpisodeDataListDataEntry: React.FC<DynamicListDataEntryProps<EpisodeData>>;
}

export const useEpisodeDataListDataEntry = (
  options: UseEpisodeDataListDataEntryOptions,
): UseEpisodeDataListDataEntryResult => {
  const EpisodeDataListDataEntry: React.FC<
    DynamicListDataEntryProps<EpisodeData>
  > = useMemo(() => {
    const EpisodeDataListDataEntry: React.FC<
      DynamicListDataEntryProps<EpisodeData>
    > = (props) => {
      const { onActionClicked, ...rest } = props;

      const {
        ModalWrapper: EpisodeSelectExplorerModal,
        openModal,
        closeModal,
      } = useEpisodeSelectExplorerModal({
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
          <EpisodeSelectExplorerModal />
        </>
      );
    };

    return EpisodeDataListDataEntry;
  }, [options.excludeItems]);

  return { EpisodeDataListDataEntry };
};
