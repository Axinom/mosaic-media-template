import { Plugin } from 'graphile-build';
import { PgClass, SQL } from 'graphile-build-pg';

const fieldName = 'titleIncludesInsensitive';

/**
 * Adds `titleIncludesInsensitive` to `MovieFilter`. It matches the same movies
 * as `title: { includesInsensitive }`, but finds them through
 * `app_hidden.movie_ids_matching_title`, which can use the trigram index on the
 * title also when row level security is enabled. The movies query still applies
 * row level security. As a filter field it can be combined with all other
 * filter fields, including `and`, `or`, `not` and relation filters.
 */
export const TitleSearchFilterPlugin: Plugin = (builder) => {
  builder.hook('GraphQLInputObjectType:fields', (fields, build, context) => {
    const {
      scope: { isPgConnectionFilter, pgIntrospection },
      Self,
      fieldWithHooks,
    } = context;
    const table = pgIntrospection as PgClass | undefined;
    if (
      !isPgConnectionFilter ||
      table?.kind !== 'class' ||
      table.namespaceName !== 'app_public' ||
      table.name !== 'movies'
    ) {
      return fields;
    }

    const {
      extend,
      pgSql: sql,
      graphql: { GraphQLString },
      connectionFilterRegisterResolver,
      escapeLikeWildcards,
    } = build;

    connectionFilterRegisterResolver(
      Self.name,
      fieldName,
      ({
        sourceAlias,
        fieldValue,
      }: {
        sourceAlias: SQL;
        fieldValue: string;
      }): SQL => {
        const pattern = `%${escapeLikeWildcards(fieldValue)}%`;
        return sql.query`${sourceAlias}.${sql.identifier(
          'id',
        )} IN (SELECT app_hidden.movie_ids_matching_title(${sql.value(
          pattern,
        )}))`;
      },
    );

    return extend(
      fields,
      {
        [fieldName]: fieldWithHooks(
          fieldName,
          {
            description:
              'Contains the specified string (case-insensitive). Matches the same movies as `title: { includesInsensitive }` but can use the title search index.',
            type: GraphQLString,
          },
          { isPgConnectionFilterField: true },
        ),
      },
      `Adding title search filter field to '${Self.name}'`,
    );
  });
};
