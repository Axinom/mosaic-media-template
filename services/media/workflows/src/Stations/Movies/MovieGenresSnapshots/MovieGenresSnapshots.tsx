import React from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  EntityType,
  useCreateMovieGenresSnapshotMutation,
} from '../../../generated/graphql';
import { PublishingSnapshotExplorer } from '../../Publishing/PublishingSnapshotExplorer/PublishingSnapshotExplorer';

export const MovieGenresSnapshots: React.FC = () => {
  const history = useHistory();

  const [createMovieGenresSnapshotMutation] =
    useCreateMovieGenresSnapshotMutation({
      client,
      fetchPolicy: 'no-cache',
    });

  const handleItemCreate = async (): Promise<void> => {
    const { data } = await createMovieGenresSnapshotMutation();

    history.push(
      `/settings/media/moviegenres/snapshots/${data?.createMovieGenresSnapshot?.id}`,
    );
  };

  return (
    <PublishingSnapshotExplorer
      title="Publishing Snapshots"
      stationKey="MovieGenresSnapshotExplorer"
      entityType={EntityType.MovieGenre}
      calculateNavigateUrl={(item) =>
        `/settings/media/moviegenres/snapshots/${item.id}`
      }
      onCreateAction={handleItemCreate}
    />
  );
};
