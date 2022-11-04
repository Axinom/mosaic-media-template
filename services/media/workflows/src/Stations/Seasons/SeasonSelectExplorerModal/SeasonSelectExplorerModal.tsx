import { IconName, useModal, UseModalResult } from '@axinom/mosaic-ui';
import React from 'react';
import { SeasonExplorer } from '../SeasonExplorerBase/SeasonExplorer';
import { UseSeasonSelectExplorerModalOptions } from './SeasonSelectExplorerModal.types';

export const useSeasonSelectExplorerModal = ({
  excludeItems,
  title = 'Select Season',
  onSelection,
}: UseSeasonSelectExplorerModalOptions): UseModalResult =>
  useModal(({ closeModal }) => (
    <SeasonExplorer
      kind="SelectionExplorer"
      title={title}
      stationKey={'SeasonSelection'}
      onSelection={(selection) => {
        onSelection?.(selection);
        closeModal();
      }}
      excludeItems={excludeItems}
      actions={[
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
