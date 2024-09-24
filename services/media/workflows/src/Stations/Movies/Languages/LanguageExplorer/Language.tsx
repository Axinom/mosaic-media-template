import React from 'react';
import { LanguagesExplorer } from '../LanguageExplorerBase/LanguagesExplorer';

export const Language: React.FC = () => {
  return (
    <LanguagesExplorer
      title="Languages"
      stationKey="LanguagesExplorer"
      kind="NavigationExplorer"
      calculateNavigateUrl={(item) => `/languages/${item.id}`}
      onCreateAction="/languages/create"
    />
  );
};
