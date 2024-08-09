import React from 'react';
import { CollectionsExplorer } from './CollectionsExplorer';
// import { useMoviesActions } from './Movies.actions';

export const Collections: React.FC = () => {
  // const { bulkActions } = useMoviesActions();

  return (
    <CollectionsExplorer
      title="Collections"
      stationKey="collectionsExplorer"
      kind="NavigationExplorer"
      calculateNavigateUrl={(item) => `/collections/${item.id}`}
      onCreateAction="/collections/create"
      // bulkActions={bulkActions}
    />
  );
};
