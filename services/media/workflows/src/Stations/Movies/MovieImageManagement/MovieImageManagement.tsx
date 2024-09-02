import React from 'react';
import { useParams } from 'react-router-dom';
import { MovieImageManagementForm } from './MovieImageManagementForm';

export const MovieImageManagement: React.FC = () => {
  const movieId = Number(
    useParams<{
      movieId: string;
    }>().movieId,
  );
  return <MovieImageManagementForm movieId={movieId} />;
};
