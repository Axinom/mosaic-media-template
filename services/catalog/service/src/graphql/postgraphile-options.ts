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
import { catalogLogMapper, CommonErrors, Config } from '../common';
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
  return new PostgraphileOptionsBuilder()
    .setDefaultSettings(config.isDev, config.graphqlGuiEnabled)
    .setErrorsHandler((errors, req) => {
      return enhanceGraphqlErrors(
        errors,
        req.body?.operationName,
        customizeGraphQlErrorFields(defaultPgErrorMapper),
        logGraphQlError(catalogLogMapper),
      );
    })
    .setHeader('Access-Control-Max-Age', 86400)
    .setPgSettings(async () => ({ role: config.dbGqlRole }))
    .addPlugins(
      PgSimplifyInflectorPlugin,
      PgSmallNumericToFloatPlugin,
      ConnectionFilterPlugin,
      SmartTagsPlugin,
      OmitFromQueryRootPlugin,
      AllMoviePlugins,
      AllTvshowPlugins,
      AddErrorCodesEnumPluginFactory([MosaicErrors, CommonErrors]),
    )
    .addGraphileBuildOptions({ pgSkipInstallingWatchFixtures: true })
    .build();
}
