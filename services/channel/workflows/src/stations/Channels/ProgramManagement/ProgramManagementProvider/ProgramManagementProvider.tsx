import React, { PropsWithChildren, useRef, useState } from 'react';
import { getProviders } from '../../../../externals';
import {
  FastProviderData,
  ProgramManagementContextMetadata,
  ProgramManagementContextProps,
  ProgramMap,
} from '../ProgramManagement.types';

const defaultMetadata: ProgramManagementContextMetadata = {
  playListDuration: undefined,
  playListEndTime: undefined,
  playListStartTime: undefined,
  entityTypeCounts: {},
};

export const ProgramManagementContext =
  React.createContext<ProgramManagementContextProps>({
    metadata: defaultMetadata,
    updateMetadata: () => defaultMetadata,
    allProviders: [],
    providerTypeMap: {},
  });

// Responsible for passing metadata to the info panel and all provider info to form
export const ProgramManagementProvider = ({
  children,
}: PropsWithChildren<ProgramManagementContextMetadata>): JSX.Element => {
  const allProviders = useRef<FastProviderData[]>(
    getProviders('fast-provider') ?? [],
  );

  // Can probably use this map in the future 'Components Overview' for a more accurate list of entities
  const providerTypeMap = useRef<ProgramMap>(
    mapProviderTypes(allProviders.current) ?? {},
  );

  const [metadata, setMetadata] =
    useState<ProgramManagementContextMetadata>(defaultMetadata);

  const updateMetadata = (value: ProgramManagementContextMetadata): void => {
    setMetadata((prevState) => {
      return { ...prevState, ...value };
    });
  };

  return (
    <ProgramManagementContext.Provider
      value={{
        metadata,
        updateMetadata,
        allProviders: allProviders.current,
        providerTypeMap: providerTypeMap.current,
      }}
    >
      {children}
    </ProgramManagementContext.Provider>
  );
};

const mapProviderTypes = (providerTypes?: FastProviderData[]): ProgramMap => {
  const episodeProvider = providerTypes?.find((pd) => pd.type === 'EPISODE');
  const movieProvider = providerTypes?.find((pd) => pd.type === 'MOVIE');
  if (!episodeProvider || !movieProvider) {
    throw new Error('The episode and movie provider must be defined');
  }
  return {
    EPISODE: episodeProvider,
    MOVIE: movieProvider,
  };
};
