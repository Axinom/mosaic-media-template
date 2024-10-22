import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { EpisodeData } from '../EpisodeExplorerBase/EpisodeExplorer.types';
import { EpisodeVideoManagementForm } from './EpisodeVideoManagementForm';

export const EpisodeVideoManagementQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<EpisodeData>>(QuickEditContext);

  return selectedItem ? (
    <EpisodeVideoManagementForm episodeId={selectedItem?.id} />
  ) : null;
};
