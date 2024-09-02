import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { SeasonData } from '../SeasonExplorerBase/SeasonExplorer.types';
import { SeasonVideoManagementForm } from './SeasonVideoManagementForm';

export const SeasonVideoManagementQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<SeasonData>>(QuickEditContext);

  return selectedItem ? (
    <SeasonVideoManagementForm seasonId={selectedItem?.id} />
  ) : null;
};
