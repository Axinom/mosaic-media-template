import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { client } from '../../../apolloClient';
import {
  ReviewTitleDocument,
  ReviewTitleQuery,
} from '../../../generated/graphql';

export const ReviewDetailsCrumb: BreadcrumbResolver = (params) => {
  return async (): Promise<string> => {
    const response = await client.query<ReviewTitleQuery>({
      query: ReviewTitleDocument,
      variables: {
        id: Number(params['reviewId']),
      },
      errorPolicy: 'ignore',
    });
    return response.data.review?.title || 'Review Details';
  };
};
