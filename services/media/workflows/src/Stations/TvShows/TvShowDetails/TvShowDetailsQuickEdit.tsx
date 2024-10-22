import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { TvShowData } from '../TvShowExplorerBase/TvShowExplorer.types';
import { TvShowDetailsForm } from './TvShowDetailsForm';

export const TvShowDetailsQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<TvShowData>>(QuickEditContext);

  return selectedItem ? <TvShowDetailsForm tvshowId={selectedItem.id} /> : null;
};
