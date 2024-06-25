import { Modal } from '@axinom/mosaic-ui';
import React from 'react';
import { FastProviderData, ProgramEntity } from '../ProgramManagement.types';

interface EntityProviderProps {
  provider?: FastProviderData;
  setProvider: React.Dispatch<
    React.SetStateAction<FastProviderData | undefined>
  >;
  onNewSelection: (items: ProgramEntity[]) => void;
}

export const EntityProvider: React.FC<EntityProviderProps> = ({
  provider,
  setProvider,
  onNewSelection,
}) => {
  const onProviderCloseHandler = (): void => {
    setProvider(undefined);
  };

  return (
    <Modal
      isShown={provider !== undefined}
      onClose={onProviderCloseHandler}
      onBackDropClicked={onProviderCloseHandler}
    >
      {provider && (
        <provider.selectionComponent
          onClose={onProviderCloseHandler}
          onSelected={(items) => {
            const programItems = items.map((item) => {
              return { ...item, entityType: provider.type };
            });
            onNewSelection(programItems as ProgramEntity[]);
            onProviderCloseHandler();
          }}
        />
      )}
    </Modal>
  );
};
