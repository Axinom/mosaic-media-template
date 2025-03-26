import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  EntityType,
  useCreateReviewSnapshotMutation,
} from '../../../generated/graphql';
import { PublishingSnapshotExplorer } from '../../Publishing/PublishingSnapshotExplorer/PublishingSnapshotExplorer';

export const ReviewSnapshots: React.FC = () => {
  const history = useHistory();

  const reviewId = Number(
    useParams<{
      reviewId: string;
    }>().reviewId,
  );

  const [createReviewSnapshotMutation] = useCreateReviewSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const handleItemCreate = async (): Promise<void> => {
    const { data } = await createReviewSnapshotMutation({
      variables: { reviewId },
    });

    history.push(
      `/reviews/${reviewId}/snapshots/${data?.createReviewSnapshot?.id}`,
    );
  };

  return (
    <PublishingSnapshotExplorer
      title="Publishing Snapshots"
      stationKey="ReviewSnapshotExplorer"
      entityId={reviewId}
      entityType={EntityType.Review}
      calculateNavigateUrl={(item) =>
        `/reviews/${reviewId}/snapshots/${item.id}`
      }
      onCreateAction={handleItemCreate}
    />
  );
};
