import React from 'react';
import { CollectionsExplorer } from './CollectionsExplorer';

export const Collections: React.FC = () => {
  return (
    <CollectionsExplorer
      title="Collections"
      stationKey="collectionsExplorer"
      kind="NavigationExplorer"
      calculateNavigateUrl={(item) => `/collections/${item.id}`}
      onCreateAction="/collections/create"
    />
  );
};
