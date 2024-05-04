import {
  ButtonContext,
  DynamicListDataEntry,
  DynamicListDataEntryProps,
} from '@axinom/mosaic-ui';
import React, { useMemo } from 'react';
import { useEpisodeSelectExplorerModal } from '../../../Episodes/EpisodeSelectExplorerModal/EpisodeSelectExplorerModal';
import { SeasonEpisode } from '../SeasonEpisodeManagement.types';

interface UseEpisodeDataListDataEntryOptions {
  excludeItems: SeasonEpisode[];
}

interface UseEpisodeDataListDataEntryResult {
  EpisodeDataListDataEntry: React.FC<DynamicListDataEntryProps<SeasonEpisode>>;
}

export const useEpisodeDataListDataEntry = (
  options: UseEpisodeDataListDataEntryOptions,
): UseEpisodeDataListDataEntryResult => {
  const EpisodeDataListDataEntry: React.FC<DynamicListDataEntryProps<
    SeasonEpisode
  >> = useMemo(() => {
    const EpisodeDataListDataEntry: React.FC<DynamicListDataEntryProps<
      SeasonEpisode
    >> = (props) => {
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
