import React from 'react';
import { useParams } from 'react-router-dom';
import { CollectionEntityManagementForm } from './CollectionEntityManagementForm';

export const CollectionEntityManagement: React.FC = () => {
  const collectionId = Number(
    useParams<{
      collectionId: string;
    }>().collectionId,
  );

  return <CollectionEntityManagementForm collectionId={collectionId} />;
};
