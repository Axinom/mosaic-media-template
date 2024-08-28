import { ApolloError } from '@apollo/client';
import { client } from '../../../../apolloClient';
import {
  EntityType,
  useCollectionRelatedEntitiesQuery,
} from '../../../../generated/graphql';
import { CollectionRelatedEntity } from '../CollectionEntityManagement.types';

interface useCollectionRelatedEntitiesResult {
  data: CollectionRelatedEntity[] | undefined;
  loading: boolean;
  error?: ApolloError;
}

export const useCollectionRelatedEntities = (
  _collectionId: number,
): useCollectionRelatedEntitiesResult => {
  const { data, loading, error } = useCollectionRelatedEntitiesQuery({
    client,
    variables: { id: 1 },
    fetchPolicy: 'no-cache',
  });

  const mappedData: CollectionRelatedEntity[] | undefined =
    data?.collection?.collectionRelations.nodes.map((node) => {
      if (node && node.movie) {
        return {
          ...node.movie,
          id: node.id,
          sortOrder: node.sortOrder,
          entityType: EntityType.Movie,
        };
      } else {
        throw new Error('Invalid Collection Entity');
      }
    });

  return { data: mappedData, loading, error };
};
