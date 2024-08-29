import React from 'react';
import { useParams } from 'react-router-dom';
import { TvShowDetailsForm } from './TvShowDetailsForm';

export const TvShowDetails: React.FC = () => {
  const tvshowId = Number(
    useParams<{
      tvshowId: string;
    }>().tvshowId,
  );

  return <TvShowDetailsForm tvshowId={tvshowId} />;
};
