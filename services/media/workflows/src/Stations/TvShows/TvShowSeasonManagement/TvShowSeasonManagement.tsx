import React from 'react';
import { useParams } from 'react-router-dom';
import { TvShowSeasonManagementForm } from './TvShowSeasonManagementForm';

export const TvShowSeasonManagement: React.FC = () => {
  const tvshowId = Number(
    useParams<{
      tvshowId: string;
    }>().tvshowId,
  );

  return <TvShowSeasonManagementForm tvshowId={tvshowId} />;
};
