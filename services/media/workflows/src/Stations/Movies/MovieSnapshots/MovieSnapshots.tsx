import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  EntityType,
  useCreateMovieSnapshotMutation,
} from '../../../generated/graphql';
import { PublishingSnapshotExplorer } from '../../Publishing/PublishingSnapshotExplorer/PublishingSnapshotExplorer';

export const MovieSnapshots: React.FC = () => {
  const history = useHistory();

  const movieId = Number(
    useParams<{
      movieId: string;
    }>().movieId,
  );

  const [createMovieSnapshotMutation] = useCreateMovieSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const handleItemCreate = async (): Promise<void> => {
    const { data } = await createMovieSnapshotMutation({
      variables: { movieId },
    });

    history.push(
      `/movies/${movieId}/snapshots/${data?.createMovieSnapshot?.id}`,
    );
  };

  return (
    <PublishingSnapshotExplorer
      title="Publishing Snapshots"
      stationKey="MovieSnapshotExplorer"
      entityId={movieId}
      entityType={EntityType.Movie}
      calculateNavigateUrl={(item) => `/movies/${movieId}/snapshots/${item.id}`}
      onCreateAction={handleItemCreate}
    />
  );
};
