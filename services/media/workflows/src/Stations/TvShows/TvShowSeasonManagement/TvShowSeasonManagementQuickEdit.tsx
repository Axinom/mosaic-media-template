import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { TvShowData } from '../TvShowExplorerBase/TvShowExplorer.types';
import { TvShowSeasonManagementForm } from './TvShowSeasonManagementForm';

export const TvShowSeasonManagementQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<TvShowData>>(QuickEditContext);

  return selectedItem ? (
    <TvShowSeasonManagementForm tvshowId={selectedItem.id} />
  ) : null;
};
