import {
  AddErrorCodesEnumPluginFactory,
  defaultPgErrorMapper,
  graphqlErrorsHandler,
  MosaicErrors,
  PostgraphileOptionsBuilder,
} from '@axinom/mosaic-service-common';
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import { Request, Response } from 'express';
import { PostGraphileOptions } from 'postgraphile';
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
import { catalogLogMapper, CommonErrors, Config } from '../common';
import { AllMoviePlugins } from '../domains/movies/plugins/all-movie-plugins';
import { AllTvshowPlugins } from '../domains/tvshows/plugins/all-tvshow-plugins';
import { OmitFromQueryRootPlugin, SmartTagsPlugin } from './plugins';

export function buildPostgraphileOptions(
  config: Config,
): PostGraphileOptions<Request, Response> {
  return new PostgraphileOptionsBuilder(config.isDev, config.graphqlGuiEnabled)
    .setDefaultSettings()
    .setErrorsHandler((errors) => {
      return graphqlErrorsHandler(
        errors,
        defaultPgErrorMapper,
        catalogLogMapper,
      );
    })
    .setHeader('Access-Control-Max-Age', 86400)
    .setPgSettings(async () => ({ role: config.dbGqlRole }))
    .setProperties({
      ignoreIndexes: false,
    })
    .addPlugins(
      PgSimplifyInflectorPlugin,
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
