import React from 'react';
import { useParams } from 'react-router-dom';
import { MovieDetailsForm } from './MovieDetailsForm';

export const MovieDetails: React.FC = () => {
  const movieId = Number(
    useParams<{
      movieId: string;
    }>().movieId,
  );

  return <MovieDetailsForm movieId={movieId} />;
};
