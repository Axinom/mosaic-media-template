import React from 'react';
import { useParams } from 'react-router-dom';
import { CollectionImageManagementForm } from './CollectionImageManagementForm';

export const CollectionImageManagement: React.FC = () => {
  const collectionId = Number(
    useParams<{
      collectionId: string;
    }>().collectionId,
  );

  return <CollectionImageManagementForm collectionId={collectionId} />;
};
