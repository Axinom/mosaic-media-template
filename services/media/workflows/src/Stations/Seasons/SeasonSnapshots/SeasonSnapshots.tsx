import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  EntityType,
  useCreateSeasonSnapshotMutation,
} from '../../../generated/graphql';
import { PublishingSnapshotExplorer } from '../../Publishing/PublishingSnapshotExplorer/PublishingSnapshotExplorer';

export const SeasonSnapshots: React.FC = () => {
  const history = useHistory();

  const seasonId = Number(
    useParams<{
      seasonId: string;
    }>().seasonId,
  );

  const [createSeasonSnapshotMutation] = useCreateSeasonSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const handleItemCreate = async (): Promise<void> => {
    const { data } = await createSeasonSnapshotMutation({
      variables: { seasonId },
    });

    history.push(
      `/seasons/${seasonId}/snapshots/${data?.createSeasonSnapshot?.id}`,
    );
  };

  return (
    <PublishingSnapshotExplorer
      title="Publishing Snapshots"
      stationKey="SeasonSnapshotExplorer"
      entityId={seasonId}
      entityType={EntityType.Season}
      calculateNavigateUrl={(item) =>
        `/seasons/${seasonId}/snapshots/${item.id}`
      }
      onCreateAction={handleItemCreate}
    />
  );
};
