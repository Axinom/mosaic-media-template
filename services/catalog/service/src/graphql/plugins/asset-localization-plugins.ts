import { optional } from '@axinom/mosaic-db-common';
import {
  getMappedError,
  isNullOrWhitespace,
} from '@axinom/mosaic-service-common';
import { Inflection, Plugin } from 'graphile-build';
import {
  gql,
  makeExtendSchemaPlugin,
  makePluginByCombiningPlugins,
} from 'graphile-utils';

import { makeJSONPgSmartTagsPlugin } from 'graphile-utils';
import { selectOne } from 'zapatos/db';
import { Table } from 'zapatos/schema';

const AssetLocalizationSmartTagsPlugin = (assetName: string): Plugin =>
  makeJSONPgSmartTagsPlugin({
    version: 1,
    config: {
      class: {
        [`${assetName}_localizations`]: {
          tags: {
            omit: true,
          },
          attribute: {
            [`${assetName}_id`]: {
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

const AssetLocalizationExtendPlugin = (
  assetName: string,
  localizationTable: Table,
): Plugin => {
  return makeExtendSchemaPlugin((build) => {
    const inflection: Inflection = build.inflection;
    const capitalizedAssetName = inflection.upperCamelCase(assetName);
    return {
      typeDefs: gql`
        extend type ${capitalizedAssetName} {
          """
          The localized ${assetName} metadata.
          """
          localization(
            """
            The localization is returned for the specified locale. If not defined, the default locale will be used instead.
            """
            locale: String
          ): ${capitalizedAssetName}Localization! @requires(columns: ["id"])
        }
      `,
      resolvers: {
        [capitalizedAssetName]: {
          localization: async ({ id }: { id: string }, args, context) => {
            try {
              const localization = await selectOne(localizationTable, {
                [`${assetName}_id`]: id,
                ...optional(
                  isNullOrWhitespace(args.locale) ? true : undefined,
                  () => ({ is_default_locale: true }),
                ),
                ...optional(
                  !isNullOrWhitespace(args.locale) ? args.locale : undefined,
                  (val) => ({ locale: val }),
                ),
              }).run(context.pgClient);
              return (
                localization ??
                selectOne(localizationTable, {
                  [`${assetName}_id`]: id,
                  is_default_locale: true,
                }).run(context.pgClient)
              );
            } catch (error) {
              throw getMappedError(error);
            }
          },
        },
      },
    };
  });
};

export const AssetLocalizationPlugin = (
  assetName: string,
  localizationTable: Table,
): Plugin =>
  makePluginByCombiningPlugins(
    AssetLocalizationSmartTagsPlugin(assetName),
    AssetLocalizationExtendPlugin(assetName, localizationTable),
  );
