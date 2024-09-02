import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { EpisodeData } from '../EpisodeExplorerBase/EpisodeExplorer.types';
import { EpisodeImageManagementForm } from './EpisodeImageManagementForm';

export const EpisodeImageManagementQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<EpisodeData>>(QuickEditContext);

  return selectedItem ? (
    <EpisodeImageManagementForm episodeId={selectedItem?.id} />
  ) : null;
};
