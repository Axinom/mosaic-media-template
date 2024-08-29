import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { EpisodeData } from '../EpisodeExplorerBase/EpisodeExplorer.types';
import { EpisodeDetailsForm } from './EpisodeDetailsForm';

export const EpisodeDetailsQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<EpisodeData>>(QuickEditContext);

  return selectedItem ? (
    <EpisodeDetailsForm episodeId={selectedItem.id} />
  ) : null;
};
