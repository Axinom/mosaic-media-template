import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { CollectionData } from '../CollectionsExplorer/Collections.types';
import { CollectionEntityManagementForm } from './CollectionEntityManagementForm';

export const CollectionEntityManagementQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<CollectionData>>(QuickEditContext);

  return selectedItem ? (
    <CollectionEntityManagementForm collectionId={selectedItem.id} />
  ) : null;
};
