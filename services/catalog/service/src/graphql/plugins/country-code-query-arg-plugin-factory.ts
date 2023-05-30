import { Plugin } from 'graphile-build';
/**
 * Creates a postgraphile plugin that adds an optional `countryCode` argument to specified endpoint.
 * Main objective is to wrap default endpoints and perform additional license check if `countryCode` argument is passed
 */
export const CountryCodeQueryArgPluginFactory =
  (endpointName: string): Plugin =>
  (builder) => {
    builder.hook(
      'GraphQLObjectType:fields:field:args',
      (args, build, context) => {
        const {
          scope: { fieldName, isRootQuery },
        } = context;

        if (fieldName !== endpointName || !isRootQuery) {
          return args;
        }

        return build.extend(args, {
          countryCode: {
            type: build.graphql.GraphQLString,
          },
        });
      },
    );
  };
