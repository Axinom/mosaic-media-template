import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { TvShowData } from '../TvShowExplorerBase/TvShowExplorer.types';
import { TvShowImageManagementForm } from './TvShowImageManagementForm';

export const TvShowImageManagementQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<TvShowData>>(QuickEditContext);

  return selectedItem ? (
    <TvShowImageManagementForm tvshowId={selectedItem.id} />
  ) : null;
};
