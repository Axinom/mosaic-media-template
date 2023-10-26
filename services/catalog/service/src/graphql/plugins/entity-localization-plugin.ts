import { Plugin } from 'graphile-build';
import { QueryBuilder } from 'graphile-build-pg';
import {
  embed,
  gql,
  makeExtendSchemaPlugin,
  makePluginByCombiningPlugins,
} from 'graphile-utils';

import { Table } from 'zapatos/schema';
import { MOSAIC_LOCALE_PG_KEY } from '../../common';

const wellKnownProperties = [
  {
    name: 'title',
    description: (entity: string) =>
      `Title of the ${entity.replace('_', ' ')}.`,
    required: true,
  },
  {
    name: 'synopsis',
    description: () => 'Short description of the main plot elements.',
    required: false,
  },
  {
    name: 'description',
    description: () => 'Extended synopsis.',
    required: false,
  },
];

const EntityLocalizationExtendPlugin = (
  entityName: string, // e.g. movie
  localizationTable: Table, //e.g. movie_localizations
  property: string, // e.g. ["title", "description", "synopsis"]
): Plugin => {
  return makeExtendSchemaPlugin((build) => {
    const { pgSql: sql, inflection } = build;
    const fieldDefinition = wellKnownProperties.find(
      (x) => x.name === property,
    );
    const comment = fieldDefinition
      ? `"""${fieldDefinition.description(entityName)}"""`
      : '';
    const required = fieldDefinition?.required ? `!` : '';
    const capitalizedEntityName = inflection.upperCamelCase(entityName); // e.g. Movie
    const localizations_table = sql.identifier(localizationTable);
    const schema = sql.identifier('app_public');
    const column = sql.identifier(property);
    const fk = sql.identifier(`${entityName}_id`);
    const localeKey = sql.value(MOSAIC_LOCALE_PG_KEY);
    const condition = sql.fragment`(${schema}.${localizations_table}.locale = (SELECT pg_catalog.current_setting(${localeKey}, true)) OR ${schema}.${localizations_table}.is_default_locale IS TRUE)`;
    return {
      typeDefs: gql`
        extend type ${capitalizedEntityName} {
          ${comment}
          ${property}: String${required} @pgQuery(
            fragment: ${embed((queryBuilder: QueryBuilder) => {
              const entity_table = queryBuilder.getTableAlias();
              return sql.fragment`(
                SELECT ${column} from ${schema}.${localizations_table} 
                WHERE ${schema}.${localizations_table}.${fk} = ${entity_table}.id AND ${condition} 
                ORDER BY ${schema}.${localizations_table}.is_default_locale ASC
                LIMIT 1)`;
            })}
          )
        }
      `,
    };
  });
};

export const EntityLocalizationPlugin = (
  entityName: string,
  localizationTable: Table,
  localizableProperties: string[],
): Plugin => {
  return makePluginByCombiningPlugins(
    ...localizableProperties.map((property) =>
      EntityLocalizationExtendPlugin(entityName, localizationTable, property),
    ),
  );
};
