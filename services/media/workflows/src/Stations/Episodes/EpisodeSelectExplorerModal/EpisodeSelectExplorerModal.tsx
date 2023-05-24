import { IconName, useModal, UseModalResult } from '@axinom/mosaic-ui';
import React from 'react';
import { EpisodeExplorer } from '../EpisodeExplorerBase/EpisodeExplorer';
import { UseEpisodeSelectExplorerModalOptions } from './EpisodeSelectExplorerModal.types';

export const useEpisodeSelectExplorerModal = ({
  excludeItems,
  title = 'Select Episode',
  onSelection,
}: UseEpisodeSelectExplorerModalOptions): UseModalResult =>
  useModal(({ closeModal }) => (
    <EpisodeExplorer
      kind="SelectionExplorer"
      title={title}
      stationKey={'EpisodeSelection'}
      onSelection={(selection) => {
        onSelection?.(selection);
        closeModal();
      }}
      excludeItems={excludeItems}
      actions={[
        {
          label: 'New',
          icon: IconName.External,
          onClick: () => {
            window.open('/episodes/create', '_blank');
          },
        },
        {
          label: 'Cancel',
          icon: IconName.X,
          onClick: closeModal,
        },
      ]}
      allowBulkSelect={true}
      enableSelectAll={false}
    />
  ));
