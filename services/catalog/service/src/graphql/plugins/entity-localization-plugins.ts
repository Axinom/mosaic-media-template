import { Plugin } from 'graphile-build';
import { QueryBuilder } from 'graphile-build-pg';
import {
  embed,
  gql,
  makeExtendSchemaPlugin,
  makePluginByCombiningPlugins,
} from 'graphile-utils';

import { makeJSONPgSmartTagsPlugin } from 'graphile-utils';
import { Table } from 'zapatos/schema';

const EntityLocalizationSmartTagsPlugin = (entityName: string): Plugin =>
  makeJSONPgSmartTagsPlugin({
    version: 1,
    config: {
      class: {
        [`${entityName}_localizations`]: {
          tags: {
            omit: true,
          },
          attribute: {
            [`${entityName}_id`]: {
              tags: {
                omit: true,
              },
            },
            locale: {
              tags: {
                omit: true,
              },
            },
            id: {
              tags: {
                omit: true,
              },
            },
            is_default_locale: {
              tags: {
                omit: true,
              },
            },
          },
        },
      },
    },
  });

const EntityLocalizationExtendPlugin = (
  entityName: string,
  localizationTable: Table,
): Plugin => {
  return makeExtendSchemaPlugin((build) => {
    const { pgSql: sql, inflection } = build;
    const capitalizedEntityName = inflection.upperCamelCase(entityName);
    return {
      typeDefs: gql`
        extend type ${capitalizedEntityName} {
          """
          The localized ${entityName} metadata.
          """
          localization(
            """
            The localizable field values are returned for the requested locale. In case the locale is not provided or does not exist, the default locale will be used.
            """
            locale: String
          ): ${capitalizedEntityName}Localization! @pgQuery(
            source: ${embed(
              sql.fragment`app_public.${sql.identifier(localizationTable)}`,
            )}
            withQueryBuilder: ${embed(
              (queryBuilder: QueryBuilder, args: { locale?: string }) => {
                const entity_table =
                  queryBuilder.parentQueryBuilder?.getTableAlias() ??
                  sql.identifier(entityName);
                const localizations_table = queryBuilder.getTableAlias();
                const fk = sql.identifier(`${entityName}_id`);
                const isDefault = sql.fragment`${localizations_table}.is_default_locale IS TRUE`;
                const condition = args.locale
                  ? sql.fragment`(${localizations_table}.locale = ${sql.value(
                      args.locale,
                    )} OR ${isDefault})`
                  : isDefault;
                queryBuilder.where(
                  sql.fragment`${localizations_table}.${fk} = ${entity_table}.id AND ${condition}`,
                );
                queryBuilder.orderBy(sql.fragment`is_default_locale`, true);
                queryBuilder.limit(1);
              },
            )}
          )
        }
      `,
    };
  });
};

export const EntityLocalizationPlugin = (
  entityName: string,
  localizationTable: Table,
): Plugin =>
  makePluginByCombiningPlugins(
    EntityLocalizationSmartTagsPlugin(entityName),
    EntityLocalizationExtendPlugin(entityName, localizationTable),
  );
