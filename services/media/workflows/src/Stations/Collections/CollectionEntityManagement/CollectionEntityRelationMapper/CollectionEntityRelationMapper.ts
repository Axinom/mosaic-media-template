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
  collectionId: number,
): useCollectionRelatedEntitiesResult => {
  const { data, loading, error } = useCollectionRelatedEntitiesQuery({
    client,
    variables: { id: collectionId },
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
      } else if (node && node.tvshow) {
        return {
          ...node.tvshow,
          id: node.id,
          sortOrder: node.sortOrder,
          entityType: EntityType.Tvshow,
        };
      } else if (node && node.season) {
        return {
          ...node.season,
          id: node.id,
          title: `Season ${node.season.index}`,
          sortOrder: node.sortOrder,
          entityType: EntityType.Season,
        };
      } else if (node && node.episode) {
        return {
          ...node.episode,
          id: node.id,
          sortOrder: node.sortOrder,
          entityType: EntityType.Episode,
        };
      } else {
        throw new Error('Invalid Collection Entity');
      }
    });

  return { data: mappedData, loading, error };
};
