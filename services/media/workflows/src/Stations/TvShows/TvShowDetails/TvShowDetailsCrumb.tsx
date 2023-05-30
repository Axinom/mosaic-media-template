import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { client } from '../../../apolloClient';
import {
  TvShowTitleDocument,
  TvShowTitleQuery,
} from '../../../generated/graphql';

export const TvShowDetailsCrumb: BreadcrumbResolver = (params) => {
  return async (): Promise<string> => {
    const response = await client.query<TvShowTitleQuery>({
      query: TvShowTitleDocument,
      variables: {
        id: Number(params['tvshowId']),
      },
      errorPolicy: 'ignore',
    });
    return response.data.tvshow?.title ?? 'TV Show Details';
  };
};
