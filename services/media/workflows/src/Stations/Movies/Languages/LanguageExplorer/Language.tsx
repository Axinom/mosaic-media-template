import React from 'react';
import { LanguagesExplorer } from '../LanguageExplorerBase/LanguagesExplorer';

export const Language: React.FC = () => {
  return (
    <LanguagesExplorer
      title="Languages"
      stationKey="LanguagesExplorer"
      kind="NavigationExplorer"
      calculateNavigateUrl={(item) => `/settings/media/languages/${item.id}`}
      onCreateAction="/settings/media/languages/create"
    />
  );
};
