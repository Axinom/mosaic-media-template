import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { client } from '../../../apolloClient';
import {
  CollectionTitleDocument,
  CollectionTitleQuery,
} from '../../../generated/graphql';

export const CollectionDetailsCrumb: BreadcrumbResolver = ({
  collectionId,
}) => {
  return async (): Promise<string> => {
    const response = await client.query<CollectionTitleQuery>({
      query: CollectionTitleDocument,
      variables: {
        id: Number(collectionId),
      },
      errorPolicy: 'ignore',
    });
    return response.data.collection?.title || 'Collection Details';
  };
};
