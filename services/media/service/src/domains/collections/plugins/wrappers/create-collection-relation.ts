import { MosaicError } from '@axinom/mosaic-service-common';
import { makeWrapResolversPlugin } from 'postgraphile';
import { ExtendedGraphQLContext } from 'src/graphql/plugins/extended-graphql-context';
import { Mutations } from '../../../../generated/graphql/operations';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createCollectionRelation = () => {
  return {
    resolve: async (
      resolve: any,
      _source: any,
      args: { [argName: string]: any },
      context: ExtendedGraphQLContext,
    ) => {
      const { pgClient } = context;
      if (pgClient === undefined) {
        throw new MosaicError({
          message: 'pgClient is undefined',
        });
      }

      const query = `
          WITH RECURSIVE CTE AS (
          SELECT  id, 
                  child_collection_id, 
                  id AS root_collection_id, 
                  1 AS level
          FROM collection_relations
          WHERE child_collection_id IS NOT NULL
          UNION ALL
          SELECT  t.id, 
                  t.child_collection_id, 
                  CTE.root_collection_id, 
                  CTE.level + 1
          FROM collection_relations t
          INNER JOIN CTE ON t.id = CTE.child_collection_id
          WHERE t.child_collection_id = $1
          )
          SELECT DISTINCT   root_collection_id
          FROM CTE
          WHERE id = $2;
          `;

      const values = [
        args.input.collectionRelation.collectionId,
        args.input.collectionRelation.childCollectionId,
      ];
      const collectionRelation = await pgClient.query(query, values);

      if (collectionRelation.rows.length > 0) {
        throw new MosaicError({
          code: 'CIRCULAR_COLLECTION_RELATION_NOT_ALLOWED',
          message:
            'Unable to add because of circular relationship between child collection and parent collection',
        });
      } else {
        const result = await resolve();
        return result;
      }
    },
  };
};

/**
 * This plugin prevent from adding circular collection relations
 */
export const CreateCollectionRelationPlugin = makeWrapResolversPlugin({
  Mutation: {
    [Mutations.createCollectionRelation]: createCollectionRelation(),
  },
});
