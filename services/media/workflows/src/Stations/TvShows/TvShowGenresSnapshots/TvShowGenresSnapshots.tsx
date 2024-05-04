import React from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  EntityType,
  useCreateTvShowGenresMutation,
} from '../../../generated/graphql';
import { PublishingSnapshotExplorer } from '../../Publishing/PublishingSnapshotExplorer/PublishingSnapshotExplorer';

export const TvShowGenresSnapshots: React.FC = () => {
  const history = useHistory();

  const [createTvShowSnapshotMutation] = useCreateTvShowGenresMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const handleItemCreate = async (): Promise<void> => {
    const { data } = await createTvShowSnapshotMutation();

    history.push(
      `/settings/media/tvshowgenres/snapshots/${data?.createTvshowGenresSnapshot?.id}`,
    );
  };

  return (
    <PublishingSnapshotExplorer
      title="Publishing Snapshots"
      stationKey="TvShowGenresSnapshotExplorer"
      entityType={EntityType.TvshowGenre}
      calculateNavigateUrl={(item) =>
        `/settings/media/tvshowgenres/snapshots/${item.id}`
      }
      onCreateAction={handleItemCreate}
    />
  );
};
