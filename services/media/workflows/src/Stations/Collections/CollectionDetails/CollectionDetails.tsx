import React from 'react';

import { useParams } from 'react-router-dom';
import { CollectionDetailsForm } from './CollectionDetailsForm';

interface UrlParams {
  collectionId: string;
}

export const CollectionDetails: React.FC = () => {
  const { collectionId } = useParams<UrlParams>();

  return <CollectionDetailsForm collectionId={Number(collectionId)} />;
};
