import {
  isNullOrWhitespace,
  Logger,
  MosaicError,
} from '@axinom/mosaic-service-common';
import {
  makePluginByCombiningPlugins,
  makeWrapResolversPlugin,
} from 'graphile-utils';
import { param, select, sql } from 'zapatos/db';
import {
  CommonErrors,
  isLicenseValid,
  MOSAIC_COUNTRY_CODE_PG_KEY,
} from '../../../common';
import { CountryCodeQueryArgPluginFactory } from '../../../graphql/plugins';

const CheckOptionalCountryCodePlugin = makeWrapResolversPlugin({
  Query: {
    async movie(resolve, source, args, context, resolveInfo) {
      const { pgClient } = context;
      // We set the country code for the current request as a PG Setting for the current transaction
      // It is used to determine the license validity in the `movie_videos_view`.
      // This is only used if we need to override default behaviour of extracting the country code through the ip.
      if (!isNullOrWhitespace(args.countryCode)) {
        await sql`SELECT set_config(${param(
          MOSAIC_COUNTRY_CODE_PG_KEY,
        )},  ${param(args.countryCode)}, true)`.run(pgClient);
      }

      const result = await resolve(source, args, context, resolveInfo);
      if (!result) {
        return result;
      }

      const licenses = await select(
        'movie_licenses',
        { movie_id: args.id },
        { columns: ['countries', 'start_time', 'end_time'] },
      ).run(context.pgClient);
      const logger = new Logger({
        context: 'extend-movie-query-with-country-code-plugin',
      });
      logger.debug({
        message: 'Checking license validity',
        details: {
          countryCode: args.countryCode,
          movieId: args.id,
        },
      });
      const validity = isLicenseValid(args.countryCode, 'movie', licenses);

      // No licenses is also fine
      if (
        validity === true ||
        validity.code === CommonErrors.LicenseNotFound.code
      ) {
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
