import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { client } from '../../../../apolloClient';
import {
  LanguageTitleDocument,
  LanguageTitleQuery,
} from '../../../../generated/graphql';

export const LanguageDetailsCrumb: BreadcrumbResolver = (params) => {
  return async (): Promise<string> => {
    const response = await client.query<LanguageTitleQuery>({
      query: LanguageTitleDocument,
      variables: {
        id: Number(params['languageId']),
      },
      errorPolicy: 'ignore',
    });
    return response.data.language?.title ?? 'Language Details';
  };
};
