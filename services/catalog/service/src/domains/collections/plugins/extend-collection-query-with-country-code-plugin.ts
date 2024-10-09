import { isNullOrWhitespace, MosaicError } from '@axinom/mosaic-service-common';
import {
  makePluginByCombiningPlugins,
  makeWrapResolversPlugin,
} from 'graphile-utils';
import { JSONOnlyColsForTable, select } from 'zapatos/db';
import { CommonErrors } from '../../../common/errors';
import { CountryCodeQueryArgPluginFactory } from '../../../graphql/plugins';

// All licenses are the same, so using movie_licenses type as a base
type License = JSONOnlyColsForTable<'movie_licenses', 'countries'[]>;

const CheckOptionalCountryCodePlugin = makeWrapResolversPlugin({
  Query: {
    async collection(resolve, source, args, context, resolveInfo) {
      const result = await resolve(source, args, context, resolveInfo);

      if (isNullOrWhitespace(args.countryCode) || !result) {
        return result;
      }

      const licenses = await select(
        'collection',
        { id: args.id },
        { columns: ['countries'] },
      ).run(context.pgClient);

      const validity = licenses.some(
        (license: License) =>
          license.countries && // Must have at least one property defined
          (!license.countries || // Must have empty countries (valid for all countries), or must include user countryCode
            license.countries.length === 0 ||
            license.countries.includes(args.countryCode)),
      );

      if (validity === true) {
        return result;
      } else {
        throw new MosaicError({
          ...CommonErrors.LicenseIsNotValid,
          messageParams: ['collection', args.countryCode],
        });
      }
    },
  },
});

export const ExtendCollectionQueryWithCountryCodePlugin =
  makePluginByCombiningPlugins(
    CountryCodeQueryArgPluginFactory('collection'),
    CheckOptionalCountryCodePlugin,
  );
