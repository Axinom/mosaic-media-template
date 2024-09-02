import React from 'react';
import { useParams } from 'react-router-dom';
import { SeasonVideoManagementForm } from './SeasonVideoManagementForm';

export const SeasonVideoManagement: React.FC = () => {
  const { seasonId } = useParams<{
    seasonId: string;
  }>();

  return <SeasonVideoManagementForm seasonId={Number(seasonId)} />;
};
