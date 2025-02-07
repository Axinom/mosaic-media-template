import { MosaicError } from '@axinom/mosaic-service-common';
import { makeWrapResolversPlugin } from 'postgraphile';
import { ExtendedGraphQLContext } from 'src/graphql/plugins/extended-graphql-context';
import { Mutations } from '../../../../generated/graphql/operations';
import { assertCircularCollectionRelation } from '../../common';

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

      await assertCircularCollectionRelation(
        pgClient,
        args.input.collectionRelation.collectionId,
        args.input.collectionRelation.childCollectionId,
      );
      const result = await resolve();
      return result;
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
