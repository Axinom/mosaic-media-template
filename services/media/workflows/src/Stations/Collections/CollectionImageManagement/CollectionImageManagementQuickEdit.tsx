import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { CollectionData } from '../CollectionsExplorer/Collections.types';
import { CollectionImageManagementForm } from './CollectionImageManagementForm';

export const CollectionImageManagementQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<CollectionData>>(QuickEditContext);

  return selectedItem ? (
    <CollectionImageManagementForm collectionId={selectedItem.id} />
  ) : null;
};
