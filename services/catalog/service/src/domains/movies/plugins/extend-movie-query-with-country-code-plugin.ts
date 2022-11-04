import { isNullOrWhitespace, MosaicError } from '@axinom/mosaic-service-common';
import {
  makePluginByCombiningPlugins,
  makeWrapResolversPlugin,
} from 'graphile-utils';
import { select } from 'zapatos/db';
import { isLicenseValid } from '../../../common';
import { CountryCodeQueryArgPluginFactory } from '../../../graphql/plugins';

const CheckOptionalCountryCodePlugin = makeWrapResolversPlugin({
  Query: {
    async movie(resolve, source, args, context, resolveInfo) {
      const result = await resolve(source, args, context, resolveInfo);

      if (isNullOrWhitespace(args.countryCode) || !result) {
        return result;
      }

      const licenses = await select(
        'movie_licenses',
        { movie_id: args.id },
        { columns: ['countries', 'start_time', 'end_time'] },
      ).run(context.pgClient);
      const validity = isLicenseValid(args.countryCode, 'movie', licenses);

      if (validity === true) {
        return result;
      } else {
        throw new MosaicError(validity);
      }
    },
  },
});

/**
 * Combines 2 plugins to support new optional `countryCode` argument for `movie` endpoint.
 * If this argument is provided - movie licenses are checked for validity.
 * If at least one license is valid - movie is returned as requested.
 * If movie has no licenses or all licenses are invalid - an error is thrown and movie is not returned.
 */
export const ExtendMovieQueryWithCountryCodePlugin =
  makePluginByCombiningPlugins(
    CountryCodeQueryArgPluginFactory('movie'),
    CheckOptionalCountryCodePlugin,
  );
