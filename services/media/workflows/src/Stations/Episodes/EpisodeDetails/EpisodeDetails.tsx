import React from 'react';
import { useParams } from 'react-router-dom';
import { EpisodeDetailsForm } from './EpisodeDetailsForm';

export const EpisodeDetails: React.FC = () => {
  const episodeId = Number(
    useParams<{
      episodeId: string;
    }>().episodeId,
  );

  return <EpisodeDetailsForm episodeId={episodeId} />;
};
