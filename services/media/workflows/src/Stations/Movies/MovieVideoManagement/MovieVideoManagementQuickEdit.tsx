import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { MovieData } from '../MovieExplorerBase/MovieExplorer.types';
import { MovieVideoManagementForm } from './MovieVideoManagementForm';

export const MovieVideoManagementQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<MovieData>>(QuickEditContext);

  return selectedItem ? (
    <MovieVideoManagementForm movieId={selectedItem?.id} />
  ) : null;
};
