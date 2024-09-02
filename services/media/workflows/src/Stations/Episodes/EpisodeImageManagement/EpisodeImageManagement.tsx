import React from 'react';
import { useParams } from 'react-router-dom';
import { EpisodeImageManagementForm } from './EpisodeImageManagementForm';

export const EpisodeImageManagement: React.FC = () => {
  const episodeId = Number(
    useParams<{
      episodeId: string;
    }>().episodeId,
  );

  return <EpisodeImageManagementForm episodeId={episodeId} />;
};
