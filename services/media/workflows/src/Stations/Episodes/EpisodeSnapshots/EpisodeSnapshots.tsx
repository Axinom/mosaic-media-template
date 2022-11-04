import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  EntityType,
  useCreateEpisodeSnapshotMutation,
} from '../../../generated/graphql';
import { PublishingSnapshotExplorer } from '../../Publishing/PublishingSnapshotExplorer/PublishingSnapshotExplorer';

export const EpisodeSnapshots: React.FC = () => {
  const history = useHistory();

  const episodeId = Number(
    useParams<{
      episodeId: string;
    }>().episodeId,
  );

  const [createEpisodeSnapshotMutation] = useCreateEpisodeSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const handleItemCreate = async (): Promise<void> => {
    const { data } = await createEpisodeSnapshotMutation({
      variables: { episodeId },
    });

    history.push(
      `/episodes/${episodeId}/snapshots/${data?.createEpisodeSnapshot?.id}`,
    );
  };

  return (
    <PublishingSnapshotExplorer
      title="Publishing Snapshots"
      stationKey="EpisodeSnapshotExplorer"
      entityId={episodeId}
      entityType={EntityType.Episode}
      calculateNavigateUrl={(item) =>
        `/episodes/${episodeId}/snapshots/${item.id}`
      }
      onCreateAction={handleItemCreate}
    />
  );
};
