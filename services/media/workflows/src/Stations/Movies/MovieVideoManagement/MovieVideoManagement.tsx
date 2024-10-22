import React from 'react';
import { useParams } from 'react-router-dom';
import { MovieVideoManagementForm } from './MovieVideoManagementForm';

export const MovieVideoManagement: React.FC = () => {
  const movieId = Number(
    useParams<{
      movieId: string;
    }>().movieId,
  );

  return <MovieVideoManagementForm movieId={movieId} />;
};
