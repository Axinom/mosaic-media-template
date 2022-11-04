import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { client } from '../../../apolloClient';
import {
  SeasonTitleDocument,
  SeasonTitleQuery,
} from '../../../generated/graphql';

export const SeasonDetailsCrumb: BreadcrumbResolver = (params) => {
  return async (): Promise<string> => {
    const response = await client.query<SeasonTitleQuery>({
      query: SeasonTitleDocument,
      variables: {
        id: Number(params['seasonId']),
      },
      errorPolicy: 'ignore',
    });
    return `Season ${response.data.season?.index}` ?? 'TV Show Details';
  };
};
