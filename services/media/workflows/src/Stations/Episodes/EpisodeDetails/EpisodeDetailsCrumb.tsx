import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { client } from '../../../apolloClient';
import {
  EpisodeTitleDocument,
  EpisodeTitleQuery,
} from '../../../generated/graphql';

export const EpisodeDetailsCrumb: BreadcrumbResolver = (params) => {
  return async (): Promise<string> => {
    const response = await client.query<EpisodeTitleQuery>({
      query: EpisodeTitleDocument,
      variables: {
        id: Number(params['episodeId']),
      },
      errorPolicy: 'ignore',
    });
    return response.data.episode?.title ?? 'TV Show Details';
  };
};
