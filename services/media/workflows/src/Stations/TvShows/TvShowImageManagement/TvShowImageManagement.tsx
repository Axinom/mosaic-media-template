import React from 'react';
import { useParams } from 'react-router-dom';
import { TvShowImageManagementForm } from './TvShowImageManagementForm';

export const TvShowImageManagement: React.FC = () => {
  const tvshowId = Number(
    useParams<{
      tvshowId: string;
    }>().tvshowId,
  );

  return <TvShowImageManagementForm tvshowId={tvshowId} />;
};
