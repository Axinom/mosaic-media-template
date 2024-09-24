import { IconName, useModal, UseModalResult } from '@axinom/mosaic-ui';
import React from 'react';
import { CollectionsExplorer } from '../CollectionsExplorer/CollectionsExplorer';
import { UseCollectionSelectExplorerModalOptions } from './CollectionSelectExplorerModal.types';

export const useCollectionSelectExplorerModal = ({
  excludeItems,
  title = 'Select Collection',
  onSelection,
}: UseCollectionSelectExplorerModalOptions): UseModalResult =>
  useModal(({ closeModal }) => (
    <CollectionsExplorer
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
          openInNewTab: true,
          path: '/collections/create',
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
