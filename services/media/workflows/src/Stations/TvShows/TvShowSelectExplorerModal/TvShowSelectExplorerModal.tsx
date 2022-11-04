import { IconName, useModal, UseModalResult } from '@axinom/mosaic-ui';
import React from 'react';
import { TvShowExplorer } from '../TvShowExplorerBase/TvShowExplorer';
import { UseTvShowSelectExplorerModalOptions } from './TvShowSelectExplorerModal.types';

export const useTvShowSelectExplorerModal = ({
  excludeItems,
  title = 'Select TV Show',
  onSelection,
}: UseTvShowSelectExplorerModalOptions): UseModalResult =>
  useModal(({ closeModal }) => (
    <TvShowExplorer
      kind="SelectionExplorer"
      title={title}
      stationKey={'TvShowSelection'}
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
