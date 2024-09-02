import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { CollectionData } from '../CollectionsExplorer/Collections.types';
import { CollectionDetailsForm } from './CollectionDetailsForm';

export const CollectionDetailsQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<CollectionData>>(QuickEditContext);

  return selectedItem ? (
    <CollectionDetailsForm collectionId={selectedItem.id} />
  ) : null;
};
