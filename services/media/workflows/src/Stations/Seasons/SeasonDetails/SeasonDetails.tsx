import React from 'react';
import { useParams } from 'react-router-dom';
import { SeasonDetailsForm } from './SeasonDetailsForm';

export const SeasonDetails: React.FC = () => {
  const seasonId = Number(
    useParams<{
      seasonId: string;
    }>().seasonId,
  );

  return <SeasonDetailsForm seasonId={seasonId} />;
};
