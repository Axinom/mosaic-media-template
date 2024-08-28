import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { MovieData } from '../MovieExplorerBase/MovieExplorer.types';
import { MovieDetailsForm } from './MovieDetailsForm';

export const MovieDetailsQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<MovieData>>(QuickEditContext);

  return selectedItem ? <MovieDetailsForm movieId={selectedItem.id} /> : null;
};
