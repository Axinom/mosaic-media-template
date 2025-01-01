import { ApolloError } from '@apollo/client';
import { client } from '../../../../apolloClient';
import {
  EntityType,
  useTvshowRelatedCollectionsQuery,
} from '../../../../generated/graphql';
import { TvshowRelatedCollections } from '../CollectionEntityManagement.types';

interface useCollectionRelatedEntitiesResult {
  data: TvshowRelatedCollections[] | undefined;
  loading: boolean;
  error?: ApolloError;
}

export const useTvshowRelatedCollections = (
  tvshowId: number,
): useCollectionRelatedEntitiesResult => {
  const { data, loading, error } = useTvshowRelatedCollectionsQuery({
    client,
    variables: { id: tvshowId },
    fetchPolicy: 'no-cache',
  });

  const mappedData: TvshowRelatedCollections[] | undefined =
    data?.tvshow?.collectionRelations.nodes.map((node) => {
      if (node && node.collection) {
        return {
          ...node.collection,
          id: node.id,
          sortOrder: node.sortOrder,
          entityType: EntityType.Collection,
        };
      } else {
        throw new Error('Invalid Collection Entity');
      }
    });

  return { data: mappedData, loading, error };
};
