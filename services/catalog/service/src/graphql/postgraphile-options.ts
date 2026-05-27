import {
  AddErrorCodesEnumPluginFactory,
  enhanceGraphqlErrors,
  OmitFromQueryRootPlugin,
  PostgraphileOptionsBuilder,
} from '@axinom/mosaic-graphql-common';
import {
  customizeGraphQlErrorFields,
  defaultPgErrorMapper,
  Logger,
  logGraphQlError,
  MosaicErrors,
} from '@axinom/mosaic-service-common';
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import { Request, Response } from 'express';
import { PostGraphileOptions } from 'postgraphile';
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
import { GeoIpReaderContainer } from 'src/utils/maxmind-utils';
import {
  catalogLogMapper,
  CommonErrors,
  Config,
  getMosaicLocaleSetting,
  MOSAIC_COUNTRY_CODE_PG_KEY,
  MOSAIC_LOCALE_HEADER_KEY,
} from '../common';
import { AllCollectionPlugins } from '../domains/collections/plugins/all-collection-plugins';
import { AllMoviePlugins } from '../domains/movies/plugins/all-movie-plugins';
import { AllTvshowPlugins } from '../domains/tvshows/plugins/all-tvshow-plugins';
import {
  CustomFiltersPlugin,
  PgSmallNumericToFloatPlugin,
  SmartTagsPlugin,
} from './plugins';

export function buildPostgraphileOptions(
  config: Config,
  geoIpReaderContainer: GeoIpReaderContainer,
): PostGraphileOptions<Request, Response> {
  let options = new PostgraphileOptionsBuilder()
    .setDefaultSettings(config.isDev, config.graphqlGuiEnabled)
    .setErrorsHandler((errors, req) => {
      return enhanceGraphqlErrors(
        errors,
        req.body?.operationName,
        customizeGraphQlErrorFields(defaultPgErrorMapper),
        logGraphQlError(catalogLogMapper),
      );
    })
    .setPgSettings(async (req) => {
      const logger = new Logger({
        context: 'postgraphile-options',
      });

      const geoData = req.ip
        ? geoIpReaderContainer.reader.get(req.ip)
        : undefined;
      logger.debug({
        message: `Request IP: ${req.ip}`,
        details: {
          country: geoData?.country?.iso_code,
        },
      });
      return {
        role: config.dbGqlRole,
        ...getMosaicLocaleSetting(req),
        [MOSAIC_COUNTRY_CODE_PG_KEY]: geoData?.country?.iso_code ?? '*',
      };
    })
    .addPlugins(
      PgSimplifyInflectorPlugin,
      PgSmallNumericToFloatPlugin,
      ConnectionFilterPlugin,
      SmartTagsPlugin,
      OmitFromQueryRootPlugin,
      AllMoviePlugins,
      AllTvshowPlugins,
      AllCollectionPlugins,
      CustomFiltersPlugin,
      AddErrorCodesEnumPluginFactory([MosaicErrors, CommonErrors]),
    )
    .addGraphileBuildOptions({
      pgSkipInstallingWatchFixtures: true,
      connectionFilterRelations: true,
    });

  options = setCustomCorsHeaders(options);
  return options.build();
}

/**
 * Used to set custom CORS headers since the standard PostGraphile CORS headers which are added
 * via the { `enableCors`: true } property in the buildPostgraphileOptions are not customizable
 */
const setCustomCorsHeaders = (
  options: PostgraphileOptionsBuilder,
): PostgraphileOptionsBuilder => {
  return options
    .setProperties({ enableCors: false })
    .setHeader(
      'Access-Control-Allow-Headers',
      [
        'Origin',
        'X-Requested-With',
        'Accept',
        'Authorization',
        'X-Apollo-Tracing',
        'Content-Type',
        'Content-Length',
        'X-PostGraphile-Explain',
        MOSAIC_LOCALE_HEADER_KEY, // allow the custom header used
      ].join(', '),
    )
    .setHeader(
      'Access-Control-Allow-Methods',
      ['HEAD', 'GET', 'POST'].join(', '),
    )
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Expose-Headers', 'X-GraphQL-Event-Stream')
    .setHeader('Access-Control-Max-Age', 86400);
};
