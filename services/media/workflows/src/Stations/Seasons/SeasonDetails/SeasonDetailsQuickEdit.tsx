import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { SeasonData } from '../SeasonExplorerBase/SeasonExplorer.types';
import { SeasonDetailsForm } from './SeasonDetailsForm';

export const SeasonDetailsQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<SeasonData>>(QuickEditContext);

  return selectedItem ? <SeasonDetailsForm seasonId={selectedItem.id} /> : null;
};
