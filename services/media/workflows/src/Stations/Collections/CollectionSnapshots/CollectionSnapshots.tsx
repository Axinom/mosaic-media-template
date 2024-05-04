import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  EntityType,
  useCreateCollectionSnapshotMutation,
} from '../../../generated/graphql';
import { PublishingSnapshotExplorer } from '../../Publishing/PublishingSnapshotExplorer/PublishingSnapshotExplorer';

export const CollectionSnapshots: React.FC = () => {
  const history = useHistory();

  const collectionId = Number(
    useParams<{
      collectionId: string;
    }>().collectionId,
  );

  const [
    createCollectionSnapshotMutation,
  ] = useCreateCollectionSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const handleItemCreate = async (): Promise<void> => {
    const { data } = await createCollectionSnapshotMutation({
      variables: { collectionId },
    });

    history.push(
      `/collections/${collectionId}/snapshots/${data?.createCollectionSnapshot?.id}`,
    );
  };

  return (
    <PublishingSnapshotExplorer
      title="Publishing Snapshots"
      stationKey="CollectionSnapshotExplorer"
      entityId={collectionId}
      entityType={EntityType.Collection}
      calculateNavigateUrl={(item) =>
        `/collections/${collectionId}/snapshots/${item.id}`
      }
      onCreateAction={handleItemCreate}
    />
  );
};
