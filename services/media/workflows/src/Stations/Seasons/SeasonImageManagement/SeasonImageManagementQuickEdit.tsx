import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { SeasonData } from '../SeasonExplorerBase/SeasonExplorer.types';
import { SeasonImageManagementForm } from './SeasonImageManagementForm';

export const SeasonImageManagementQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<SeasonData>>(QuickEditContext);

  return selectedItem ? (
    <SeasonImageManagementForm seasonId={selectedItem?.id} />
  ) : null;
};
