import React from 'react';
import { useParams } from 'react-router-dom';
import { SeasonEpisodeManagementForm } from './SeasonEpisodeManagementForm';

export const SeasonEpisodeManagement: React.FC = () => {
  const { seasonId } = useParams<{
    seasonId: string;
  }>();

  return <SeasonEpisodeManagementForm seasonId={Number(seasonId)} />;
};
