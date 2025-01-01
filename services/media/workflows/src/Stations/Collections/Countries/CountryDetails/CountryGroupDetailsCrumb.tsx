import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { client } from '../../../../apolloClient';
import {
  CountryGroupTitleDocument,
  CountryGroupTitleQuery,
} from '../../../../generated/graphql';

export const CountryGroupDetailsCrumb: BreadcrumbResolver = (params) => {
  return async (): Promise<string> => {
    const response = await client.query<CountryGroupTitleQuery>({
      query: CountryGroupTitleDocument,
      variables: {
        id: params['countryId'],
      },
      errorPolicy: 'ignore',
    });
    return response.data.countryGroup?.name ?? 'Country Group Details';
  };
};
