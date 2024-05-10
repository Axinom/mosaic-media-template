import React from 'react';

import { useParams } from 'react-router-dom';
import { CollectionDetailsForm } from './CollectionDetailsForm';
import { PiletApi } from '@axinom/mosaic-portal';

interface UrlParams {
  collectionId: string;
}

interface CollectionDetailsProps {
  showNotification: PiletApi['showNotification'];
}

export const CollectionDetails: React.FC<CollectionDetailsProps> = ({
  showNotification,
}) => {
  const { collectionId } = useParams<UrlParams>();

  return <CollectionDetailsForm collectionId={Number(collectionId)} showNotification={showNotification} />;
};
