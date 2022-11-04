import { Inflection, Plugin } from 'graphile-build';
import { PgIntrospectionResultsByKind } from 'graphile-build-pg';
import { GraphQLFieldConfigMap } from 'graphql';

/**
 * Type safe interface for unpacking the relevant bits of hook context.
 */
interface HookContext {
  Self: {
    name: string;
  };
  scope: {
    isRootQuery: boolean;
  };
}

/**
 * Plugin for omitting tables from query root but keeping them still accessible from root entities through relations.
 *
 * @remarks
 * This is different from `@omit all many` as the tables are still accessible through relations.
 *
 * References:
 * - https://discord.com/channels/489127045289476126/498852330754801666/578654093963427860
 */
export const OmitFromQueryRootPlugin: Plugin = (builder) => {
  builder.hook('GraphQLObjectType:fields', (fields, build, context) => {
    const hookContext: HookContext = context as HookContext;
    const introspection: PgIntrospectionResultsByKind =
      build.pgIntrospectionResultsByKind;
    const inflection: Inflection = build.inflection;

    if (hookContext.Self.name !== 'Query' || !hookContext.scope.isRootQuery) {
      return fields;
    }

    const tablesToExclude = introspection.class.filter(
      (cls) => cls.tags.omitFromQueryRoot === true,
    );

    // Remove both single item query and paginated query.
    const fieldNamesToExclude = ([] as string[]).concat(
      ...tablesToExclude.map((cls) => [
        inflection.camelCase(`${inflection._singularizedTableName(cls)}`),
        inflection.camelCase(
          inflection.distinctPluralize(inflection._singularizedTableName(cls)),
        ),
      ]),
    );

    return removeProperties(fields, fieldNamesToExclude);
  });
};

function removeProperties(
  obj: GraphQLFieldConfigMap<unknown, unknown>,
  keysToRemove: string[],
): GraphQLFieldConfigMap<unknown, unknown> {
  const result = { ...obj };
  for (const key of keysToRemove) {
    delete result[key];
  }
  return result;
}
