import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { client } from '../../../../apolloClient';
import {
  ProgramTitleDocument,
  ProgramTitleQuery,
} from '../../../../generated/graphql';

export const ProgramDetailsCrumb: BreadcrumbResolver = (params) => {
  return async (): Promise<string> => {
    const response = await client.query<ProgramTitleQuery>({
      query: ProgramTitleDocument,
      variables: {
        id: params['programId'],
      },
      errorPolicy: 'ignore',
    });
    return response.data.program?.title ?? 'Program Details';
  };
};
