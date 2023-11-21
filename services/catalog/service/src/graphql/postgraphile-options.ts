import {
  AddErrorCodesEnumPluginFactory,
  enhanceGraphqlErrors,
  PostgraphileOptionsBuilder,
} from '@axinom/mosaic-graphql-common';
import {
  customizeGraphQlErrorFields,
  defaultPgErrorMapper,
  logGraphQlError,
  MosaicErrors,
} from '@axinom/mosaic-service-common';
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import { Request, Response } from 'express';
import { PostGraphileOptions } from 'postgraphile';
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
import {
  catalogLogMapper,
  CommonErrors,
  Config,
  MOSAIC_LOCALE_HEADER_KEY,
  MOSAIC_LOCALE_PG_KEY,
} from '../common';
import { AllChannelPlugins } from '../domains/channels/plugins/all-channel-plugins';
import { AllCollectionPlugins } from '../domains/collections/plugins/all-collection-plugins';
import { AllMoviePlugins } from '../domains/movies/plugins/all-movie-plugins';
import { AllTvshowPlugins } from '../domains/tvshows/plugins/all-tvshow-plugins';
import {
  OmitFromQueryRootPlugin,
  PgSmallNumericToFloatPlugin,
  SmartTagsPlugin,
} from './plugins';

export function buildPostgraphileOptions(
  config: Config,
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
    .setPgSettings(async (req) => ({
      role: config.dbGqlRole,
      [MOSAIC_LOCALE_PG_KEY]: req.headers[MOSAIC_LOCALE_HEADER_KEY],
    }))
    .addPlugins(
      PgSimplifyInflectorPlugin,
      PgSmallNumericToFloatPlugin,
      ConnectionFilterPlugin,
      SmartTagsPlugin,
      OmitFromQueryRootPlugin,
      AllMoviePlugins,
      AllTvshowPlugins,
      AllChannelPlugins,
      AllCollectionPlugins,
      AddErrorCodesEnumPluginFactory([MosaicErrors, CommonErrors]),
    )
    .addGraphileBuildOptions({ pgSkipInstallingWatchFixtures: true });

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
