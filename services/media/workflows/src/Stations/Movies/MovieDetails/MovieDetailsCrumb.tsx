import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { client } from '../../../apolloClient';
import {
  MovieTitleDocument,
  MovieTitleQuery,
} from '../../../generated/graphql';

export const MovieDetailsCrumb: BreadcrumbResolver = (params) => {
  return async (): Promise<string> => {
    const response = await client.query<MovieTitleQuery>({
      query: MovieTitleDocument,
      variables: {
        id: Number(params['movieId']),
      },
      errorPolicy: 'ignore',
    });
    return response.data.movie?.title ?? 'Movie Details';
  };
};
