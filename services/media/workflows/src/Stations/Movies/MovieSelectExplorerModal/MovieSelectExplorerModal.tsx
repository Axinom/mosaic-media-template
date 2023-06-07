import { IconName, useModal, UseModalResult } from '@axinom/mosaic-ui';
import React from 'react';
import { MovieExplorer } from '../MovieExplorerBase/MovieExplorer';
import { UseMovieSelectExplorerModalOptions } from './MovieSelectExplorerModal.types';

export const useMovieSelectExplorerModal = ({
  excludeItems,
  title = 'Select Movie',
  onSelection,
}: UseMovieSelectExplorerModalOptions): UseModalResult =>
  useModal(({ closeModal }) => (
    <MovieExplorer
      kind="SelectionExplorer"
      title={title}
      stationKey={'MovieSelection'}
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
            window.open('/movies/create', '_blank');
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
