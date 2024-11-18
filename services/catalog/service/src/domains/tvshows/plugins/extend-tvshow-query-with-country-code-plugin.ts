import { isNullOrWhitespace, MosaicError } from '@axinom/mosaic-service-common';
import {
  makePluginByCombiningPlugins,
  makeWrapResolversPlugin,
} from 'graphile-utils';
import { select } from 'zapatos/db';
import { CommonErrors, isLicenseValid } from '../../../common';
import { CountryCodeQueryArgPluginFactory } from '../../../graphql/plugins';
import { ErrorCodesEnum } from '@axinom/mosaic-message-bus/dist/generated/key-service';

const CheckOptionalCountryCodePlugin = makeWrapResolversPlugin({
  Query: {
    async tvshow(resolve, source, args, context, resolveInfo) {

      const result = await resolve(source, args, context, resolveInfo);
      if (!result) {
        return result;
      }

      const licenses = await select(
        'tvshow_licenses',
        { tvshow_id: args.id },
        { columns: ['countries', 'start_time', 'end_time'] },
      ).run(context.pgClient);
      const validity = isLicenseValid(args.countryCode, 'TV show', licenses);
      
      // No licenses is also fine
      if (validity === true || validity.code === CommonErrors.LicenseNotFound.code) {
        return result;
      } else {
        throw new MosaicError(validity);
      }
    },
  },
});

/**
 * Combines 2 plugins to support new optional `countryCode` argument for `tvshow` endpoint.
 * If this argument is provided - TV show licenses are checked for validity.
 * If at least one license is valid - TV show is returned as requested.
 * If TV show has no licenses or all licenses are invalid - an error is thrown and TV show is not returned.
 */
export const ExtendTvShowQueryWithCountryCodePlugin =
  makePluginByCombiningPlugins(
    CountryCodeQueryArgPluginFactory('tvshow'),
    CheckOptionalCountryCodePlugin,
  );
