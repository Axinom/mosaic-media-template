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
  return new PostgraphileOptionsBuilder()
    .setDefaultSettings(config.isDev, config.graphqlGuiEnabled)
    .setErrorsHandler((errors, req) => {
      return enhanceGraphqlErrors(
        errors,
        req.body.operationName,
        customizeGraphQlErrorFields(defaultPgErrorMapper),
        logGraphQlError(catalogLogMapper),
      );
    })
    .setHeader('Access-Control-Max-Age', 86400)
    .setPgSettings(async (req) => {
      return {
        role: config.dbGqlRole,
        [MOSAIC_LOCALE_PG_KEY]: req.headers[MOSAIC_LOCALE_HEADER_KEY],
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
      AllChannelPlugins,
      AllCollectionPlugins,
      AddErrorCodesEnumPluginFactory([MosaicErrors, CommonErrors]),
    )
    .addGraphileBuildOptions({ pgSkipInstallingWatchFixtures: true })
    .build();
}
