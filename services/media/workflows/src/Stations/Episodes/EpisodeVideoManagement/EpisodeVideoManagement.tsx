import React from 'react';
import { useParams } from 'react-router-dom';
import { EpisodeVideoManagementForm } from './EpisodeVideoManagementForm';

export const EpisodeVideoManagement: React.FC = () => {
  const episodeId = Number(
    useParams<{
      episodeId: string;
    }>().episodeId,
  );

  return <EpisodeVideoManagementForm episodeId={episodeId} />;
};
