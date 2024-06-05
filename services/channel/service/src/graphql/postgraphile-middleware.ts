import {
  buildPgSettings,
  LoginPgPool,
  OwnerPgPool,
} from '@axinom/mosaic-db-common';
import {
  AnnotateTypesWithPermissionsPlugin,
  DeprecateStrayNodeIdFieldsPlugin,
  enhanceGraphqlErrors,
  forwardToGraphiQl,
  getWebsocketFromRequest,
  OmitFromQueryRootPlugin,
  OperationsEnumGeneratorPluginFactory,
  PostgraphileOptionsBuilder,
  SubscriptionsPluginFactory,
  ValidationDirectivesPlugin,
} from '@axinom/mosaic-graphql-common';
import {
  AuthenticationConfig,
  AxGuardPlugin,
  EnforceStrictPermissionsPlugin,
  getManagementAuthenticationContext,
} from '@axinom/mosaic-id-guard';
import {
  customizeGraphQlErrorFields,
  defaultWriteLogMapper,
  getHttpServer,
  getWebsocketMiddlewares,
  Logger,
  logGraphQlError,
} from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import { Express, Request, Response } from 'express';
import postgraphile, {
  enhanceHttpServerWithSubscriptions,
  makePluginByCombiningPlugins,
  Middleware,
  PostGraphileOptions,
} from 'postgraphile';
import {
  AtomicMutationsPlugin,
  getMutationAtomicityContext,
} from 'postgraphile-plugin-atomic-mutations';
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
import { Config, customPgErrorMapper } from '../common';
import {
  permissionDefinition,
  PublishChannelPlugin,
  PublishPlaylistPlugin,
  UnpublishChannelPlugin,
  UnpublishPlaylistPlugin,
  ValidateChannelPlugin,
  ValidatePlaylistPlugin,
} from '../domains';
import { ExtendedGraphQLContext } from './models';
import {
  CuePointScheduleBigFloatToFloatPlugin,
  PgSmallNumericToFloatPlugin,
  RenameImageMutationsPlugin,
  SmartTagsPlugin,
  ValidationTypesPlugin,
} from './plugins';

export function buildPostgraphileOptions(
  config: Config,
  ownerPool: OwnerPgPool,
  storeOutboxMessage: StoreOutboxMessage,
  websocketMiddlewares: Middleware<Request, Response>[] = [],
  authConfig?: AuthenticationConfig,
): PostGraphileOptions<Request, Response> {
  const logger = new Logger({
    config,
    context: EnforceStrictPermissionsPlugin.name,
  });
  return new PostgraphileOptionsBuilder()
    .setDefaultSettings(config.isDev, config.graphqlGuiEnabled)
    .setHeader('Access-Control-Max-Age', 86400)
    .setErrorsHandler((errors, req) => {
      return enhanceGraphqlErrors(
        errors,
        req.body?.operationName,
        customizeGraphQlErrorFields(customPgErrorMapper, config.isDev),
        logGraphQlError(defaultWriteLogMapper),
      );
    })
    .setPgSettings(async (req) => {
      const { subject } = await getManagementAuthenticationContext(
        req,
        authConfig,
      );
      return buildPgSettings(subject, config.dbGqlRole, config.serviceId);
    })
    .enableSubscriptions({
      plugin: makePluginByCombiningPlugins(
        SubscriptionsPluginFactory('channels', 'Channel', 'UUID'),
        SubscriptionsPluginFactory('playlists', 'Playlist', 'UUID'),
      ),
      websocketMiddlewares,
    })
    .addPlugins(
      DeprecateStrayNodeIdFieldsPlugin('DROP'),
      PgSmallNumericToFloatPlugin,
      SmartTagsPlugin,
      PgSimplifyInflectorPlugin,
      OmitFromQueryRootPlugin,
      ValidationDirectivesPlugin,
      ConnectionFilterPlugin,
      PublishChannelPlugin,
      PublishPlaylistPlugin,
      UnpublishChannelPlugin,
      UnpublishPlaylistPlugin,
      CuePointScheduleBigFloatToFloatPlugin,
      ValidationTypesPlugin,
      ValidateChannelPlugin,
      ValidatePlaylistPlugin,
      RenameImageMutationsPlugin,
    )
    .addConditionalPlugins(
      config.isDev,
      OperationsEnumGeneratorPluginFactory({
        outRoot: './src/generated/graphql/operations',
      }),
    )
    .addPlugins(
      AxGuardPlugin(
        config,
        './src/generated/security/permission-definition.json',
      ),
      EnforceStrictPermissionsPlugin,
      AnnotateTypesWithPermissionsPlugin,
      AtomicMutationsPlugin,
    )
    .addGraphileBuildOptions({
      pgSkipInstallingWatchFixtures: true,
      connectionFilterRelations: true,
      ownerPool,
      config,
      serviceId: config.serviceId,
      permissionDefinition,
      logger,
    })
    .setAdditionalGraphQLContextFromRequest(async (req) => {
      const { subject, authErrorInfo } =
        await getManagementAuthenticationContext(req, authConfig);
      const websocket = getWebsocketFromRequest(req);
      const extendedRequest = req as Request & { token: string };
      const result: ExtendedGraphQLContext = {
        config,
        subject,
        ownerPool,
        storeOutboxMessage,
        jwtToken: extendedRequest?.token,
        authErrorInfo,
        mutationAtomicityContext: getMutationAtomicityContext(req, true),
        websocket,
      };
      return result;
    })
    .build();
}

export const setupPostGraphile = async (
  app: Express,
  ownerPool: OwnerPgPool,
  loginPool: LoginPgPool,
  config: Config,
  authConfig: AuthenticationConfig,
  storeOutboxMessage: StoreOutboxMessage,
): Promise<void> => {
  const websocketMiddlewares = getWebsocketMiddlewares(app);
  const options = buildPostgraphileOptions(
    config,
    ownerPool,
    storeOutboxMessage,
    websocketMiddlewares,
    authConfig,
  );

  if (config.graphqlGuiEnabled) {
    app.use(forwardToGraphiQl());
  }

  const middleware = postgraphile(loginPool, 'app_public', options);
  app.use(middleware);

  const httpServer = getHttpServer(app);
  if (httpServer) {
    await enhanceHttpServerWithSubscriptions(httpServer, middleware);
  }
};
