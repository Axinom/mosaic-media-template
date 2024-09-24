import { ApolloError } from '@apollo/client';
import { client } from '../../../../apolloClient';
import {
  EntityType,
  useMovieRelatedCollectionsQuery,
} from '../../../../generated/graphql';
import { MovieRelatedCollections } from '../CollectionEntityManagement.types';

interface useCollectionRelatedEntitiesResult {
  data: MovieRelatedCollections[] | undefined;
  loading: boolean;
  error?: ApolloError;
}

export const useMovieRelatedCollections = (
  movieId: number,
): useCollectionRelatedEntitiesResult => {
  const { data, loading, error } = useMovieRelatedCollectionsQuery({
    client,
    variables: { id: movieId },
    fetchPolicy: 'no-cache',
  });

  const mappedData: MovieRelatedCollections[] | undefined =
    data?.movie?.collectionRelations.nodes.map((node) => {
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
