import React from 'react';
import { useParams } from 'react-router-dom';
import { SeasonImageManagementForm } from './SeasonImageManagementForm';

export const SeasonImageManagement: React.FC = () => {
  const { seasonId } = useParams<{
    seasonId: string;
  }>();

  return <SeasonImageManagementForm seasonId={Number(seasonId)} />;
};
