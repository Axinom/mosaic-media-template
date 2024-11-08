import type { Plugin } from 'graphile-build';
import type { SQL } from 'graphile-build-pg';
import type { Build } from 'postgraphile';

export const CustomFiltersPlugin: Plugin = (builder) => {
  builder.hook('build', (build: Build) => {
    const { pgSql: sql, connectionFilterArrayOperators } = build as Build & {
      connectionFilterArrayOperators: Record<string, Record<string, any>>;
    };

    // Add a new filter operator that checks if the column contains the specified values
    connectionFilterArrayOperators.iContains = {
      description:
        'Does the column contain the specified values? (case-insensitive)',
      resolve: (identifier: SQL, value: SQL): SQL =>
        sql.fragment`ARRAY(SELECT LOWER(unnest(${identifier}::text[]))) @> ARRAY(SELECT LOWER(unnest(${value}::text[])))`,
    };

    connectionFilterArrayOperators.iOverlaps = {
      description: 
        'Does the array column contain common values with the specified array value? (case-insensitive)',
        resolve: (identifier: SQL, value: SQL): SQL => 
          sql.fragment`ARRAY(SELECT LOWER(unnest(${identifier}::text[]))) && ARRAY(SELECT LOWER(unnest(${value}::text[])))`,
    }

    return build;
  });
};
