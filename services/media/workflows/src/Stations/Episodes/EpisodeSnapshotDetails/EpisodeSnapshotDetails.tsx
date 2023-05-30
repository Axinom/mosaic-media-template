import React from 'react';
import { useParams } from 'react-router-dom';
import { EntityType } from '../../../generated/graphql';
import { PublishingSnapshotDetails } from '../../Publishing/PublishingSnapshotDetails/PublishingSnapshotDetails';

export const EpisodeSnapshotDetails: React.FC = () => {
  const snapshotId = Number(
    useParams<{
      snapshotId: string;
    }>().snapshotId,
  );

  return (
    <PublishingSnapshotDetails
      snapshotId={snapshotId}
      type={EntityType.Episode}
    />
  );
};
