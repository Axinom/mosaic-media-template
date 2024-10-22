import React from 'react';
import { useParams } from 'react-router-dom';
import { TvShowVideoManagementForm } from './TvShowVideoManagementForm';

export const TvShowVideoManagement: React.FC = () => {
  const tvshowId = Number(
    useParams<{
      tvshowId: string;
    }>().tvshowId,
  );

  return <TvShowVideoManagementForm tvshowId={tvshowId} />;
};
