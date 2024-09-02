import React from 'react';
import { useParams } from 'react-router-dom';
import { CollectionDetailsForm } from './CollectionDetailsForm';

export const CollectionDetails: React.FC = () => {
  const collectionId = Number(
    useParams<{
      collectionId: string;
    }>().collectionId,
  );

  return <CollectionDetailsForm collectionId={collectionId} />;
};
