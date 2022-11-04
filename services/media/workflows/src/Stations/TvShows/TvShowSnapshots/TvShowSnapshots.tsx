import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  EntityType,
  useCreateTvShowSnapshotMutation,
} from '../../../generated/graphql';
import { PublishingSnapshotExplorer } from '../../Publishing/PublishingSnapshotExplorer/PublishingSnapshotExplorer';

export const TvShowSnapshots: React.FC = () => {
  const history = useHistory();

  const tvshowId = Number(
    useParams<{
      tvshowId: string;
    }>().tvshowId,
  );

  const [createTvShowSnapshotMutation] = useCreateTvShowSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const handleItemCreate = async (): Promise<void> => {
    const { data } = await createTvShowSnapshotMutation({
      variables: { tvshowId },
    });

    history.push(
      `/tvshows/${tvshowId}/snapshots/${data?.createTvshowSnapshot?.id}`,
    );
  };

  return (
    <PublishingSnapshotExplorer
      title="Publishing Snapshots"
      stationKey="TvShowSnapshotExplorer"
      entityId={tvshowId}
      entityType={EntityType.Tvshow}
      calculateNavigateUrl={(item) =>
        `/tvshows/${tvshowId}/snapshots/${item.id}`
      }
      onCreateAction={handleItemCreate}
    />
  );
};
