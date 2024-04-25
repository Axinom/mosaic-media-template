import { buildPgSettings, OwnerPgPool } from '@axinom/mosaic-db-common';
import {
  AddErrorCodesEnumPluginFactory,
  AnnotateTypesWithPermissionsPlugin,
  enhanceGraphqlErrors,
  getWebsocketFromRequest,
  OperationsEnumGeneratorPluginFactory,
  PostgraphileOptionsBuilder,
  ValidationDirectivesPlugin,
} from '@axinom/mosaic-graphql-common';
import {
  AuthenticationConfig,
  AxGuardPlugin,
  EnforceStrictPermissionsPlugin,
  getManagementAuthenticationContext,
  IdGuardErrors,
} from '@axinom/mosaic-id-guard';
import {
  customizeGraphQlErrorFields,
  defaultWriteLogMapper,
  Logger,
  logGraphQlError,
  MosaicErrors,
} from '@axinom/mosaic-service-common';
import {
  StoreInboxMessage,
  StoreOutboxMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import { Request, Response } from 'express';
import { Middleware, PostGraphileOptions } from 'postgraphile';
import {
  AtomicMutationsPlugin,
  getMutationAtomicityContext,
} from 'postgraphile-plugin-atomic-mutations';
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
import { CommonErrors, Config, mediaPgErrorMapper } from '../common';
import {
  AllModulesDevPlugins,
  AllModulesPlugins,
  AllSubscriptionsPlugins,
} from '../domains/all-modules-plugins';
import { permissionDefinition } from '../domains/permission-definition';
import { AllIngestPlugins } from '../ingest';
import { AllPublishingPlugins } from '../publishing';
import { ExtendedGraphQLContext, ScalarTypesPlugin } from './plugins';

// registration of domain plugins will happen in modules root and this file will only look there, but not a level higher
export const buildPostgraphileOptions = (
  config: Config,
  ownerPool: OwnerPgPool,
  storeOutboxMessage: StoreOutboxMessage,
  storeInboxMessage: StoreInboxMessage,
  websocketMiddlewares: Middleware<Request, Response>[] = [],
  authConfig?: AuthenticationConfig,
): PostGraphileOptions<Request, Response> => {
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
        customizeGraphQlErrorFields(mediaPgErrorMapper),
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
      plugin: AllSubscriptionsPlugins,
      websocketMiddlewares,
    })
    .addPlugins(
      PgSimplifyInflectorPlugin,
      ScalarTypesPlugin,
      ValidationDirectivesPlugin,
      ConnectionFilterPlugin,
      AllIngestPlugins,
      AllPublishingPlugins,
      AllModulesPlugins,
    )
    .addConditionalPlugins(
      config.isDev,
      AllModulesDevPlugins,
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
      AddErrorCodesEnumPluginFactory([
        MosaicErrors,
        IdGuardErrors,
        CommonErrors,
      ]),
    )
    .addGraphileBuildOptions({
      pgSkipInstallingWatchFixtures: true,
      ownerPool,
      connectionFilterRelations: true,
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
        storeInboxMessage,
        jwtToken: extendedRequest?.token,
        authErrorInfo,
        mutationAtomicityContext: getMutationAtomicityContext(req, true),
        websocket,
      };
      return result;
    })
    .build();
};
