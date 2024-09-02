import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { SeasonData } from '../SeasonExplorerBase/SeasonExplorer.types';
import { SeasonEpisodeManagementForm } from './SeasonEpisodeManagementForm';

export const SeasonEpisodeManagementQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<SeasonData>>(QuickEditContext);

  return selectedItem ? (
    <SeasonEpisodeManagementForm seasonId={selectedItem?.id} />
  ) : null;
};
