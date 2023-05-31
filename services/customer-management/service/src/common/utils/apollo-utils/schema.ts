import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import path from 'path';
import { Config } from 'src/common/config';

export const authDirectiveTransformer = (
  config: Config,
  directiveName: string,
): ((schema: GraphQLSchema) => GraphQLSchema) => {
  return (schema) =>
    mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const { resolve = defaultFieldResolver } = fieldConfig;
        return {
          ...fieldConfig,
          resolve: async (source, args, context, info) => {
            const result = await resolve(source, args, context, info);
            const authDirective = getDirective(
              schema,
              fieldConfig,
              directiveName,
            );
            if (authDirective) {
              console.log('xxxxxxxxx', authDirective);
            }
            if (typeof result === 'string') {
              return result.toUpperCase();
            }
            return result;
          },
        };
      },
    });
};

export const Schema = (): GraphQLSchema => {
  const typesArray = loadFilesSync(
    path.join(__dirname, '/../../../graphql/**/*.graphql'),
  );
  const mergedTypeDefs = mergeTypeDefs(typesArray);
  const mergedResolvers = mergeResolvers(
    loadFilesSync(`${__dirname}/../../../graphql/**/*.resolvers.js`),
  );

  // const x = buildSchema(typesArray[0]);
  return makeExecutableSchema({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
  });
};
