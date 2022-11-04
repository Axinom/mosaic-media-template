import { isNullOrWhitespace, MosaicError } from '@axinom/mosaic-service-common';
import {
  makePluginByCombiningPlugins,
  makeWrapResolversPlugin,
} from 'graphile-utils';
import { parent, select, selectOne } from 'zapatos/db';
import { CommonErrors, isLicenseValid } from '../../../common';
import { CountryCodeQueryArgPluginFactory } from '../../../graphql/plugins';

const CheckOptionalCountryCodePlugin = makeWrapResolversPlugin({
  Query: {
    episode: {
      requires: {
        childColumns: [{ column: 'season_id', alias: '$seasonId' }],
      },
      async resolve(resolver, source, args, context, resolveInfo) {
        const result = await resolver(source, args, context, resolveInfo);

        if (isNullOrWhitespace(args.countryCode) || !result) {
          return result;
        }

        const licenses = await select(
          'episode_licenses',
          { episode_id: args.id },
          { columns: ['countries', 'start_time', 'end_time'] },
        ).run(context.pgClient);
        const episodeValidity = isLicenseValid(
          args.countryCode,
          'episode',
          licenses,
        );

        if (episodeValidity === true) {
          return result;
        } else if (episodeValidity.code === CommonErrors.LicenseNotFound.code) {
          const licenses = await select(
            'season_licenses',
            { season_id: result.$seasonId },
            { columns: ['countries', 'start_time', 'end_time'] },
          ).run(context.pgClient);
          const seasonValidity = isLicenseValid(
            args.countryCode,
            'season',
            licenses,
          );

          if (seasonValidity === true) {
            return result;
          } else if (
            seasonValidity.code === CommonErrors.LicenseNotFound.code
          ) {
            const season = await selectOne(
              'season',
              { id: result.$seasonId },
              {
                columns: ['tvshow_id'],
                lateral: {
                  tvshow: selectOne(
                    'tvshow',
                    { id: parent('tvshow_id') },
                    {
                      columns: ['id'],
                      lateral: {
                        licenses: select(
                          'tvshow_licenses',
                          { tvshow_id: parent('id') },
                          { columns: ['countries', 'start_time', 'end_time'] },
                        ),
                      },
                    },
                  ),
                },
              },
            ).run(context.pgClient);
            const tvshowValidity = isLicenseValid(
              args.countryCode,
              'TV show',
              season?.tvshow?.licenses,
            );

            if (tvshowValidity === true) {
              return result;
            }
          }
        }

        throw new MosaicError(episodeValidity);
      },
    },
  },
});

/**
 * Combines 2 plugins to support new optional `countryCode` argument for `episode` endpoint.
 * If this argument is provided - episode licenses are checked for validity.
 * If episode has no licenses - parent season licenses are checked. If season has no licenses - parent tv show licenses are checked.
 * If at least one license is valid - episode is returned as requested.
 * If there are no licenses or all licenses are invalid - an error is thrown and episode is not returned.
 * If child entity has licenses, but all of them are invalid - parent entity licenses are not checked.
 */
export const ExtendEpisodeQueryWithCountryCodePlugin =
  makePluginByCombiningPlugins(
    CountryCodeQueryArgPluginFactory('episode'),
    CheckOptionalCountryCodePlugin,
  );
