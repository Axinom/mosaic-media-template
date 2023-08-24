import { OwnerPgPool } from '@axinom/mosaic-db-common';
import {
  AddErrorCodesEnumPluginFactory,
  enhanceGraphqlErrors,
  PostgraphileOptionsBuilder,
} from '@axinom/mosaic-graphql-common';
import {
  AuthenticationConfig,
  AxGuardPlugin,
  getEndUserAuthenticationContext,
  IdGuardErrors,
} from '@axinom/mosaic-id-guard';
import { EndUserAuthorizationConfig } from '@axinom/mosaic-id-utils';
import {
  customizeGraphQlErrorFields,
  defaultPgErrorMapper,
  isNullOrWhitespace,
  Logger,
  logGraphQlError,
  MosaicErrors,
  WebhookErrors,
} from '@axinom/mosaic-service-common';
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import { Request, Response } from 'express';
import { PostGraphileOptions } from 'postgraphile';
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
import { CommonErrors, Config } from '../common';
import { entitlementLogMapper } from '../common/errors/entitlement-log-mapper';
import { EntitlementEndpointPlugin, ExtendedGraphQLContext } from './plugins';

const endUserAuthorizationConfig: EndUserAuthorizationConfig = {
  anonymousGqlOperations: [],
  applicationTokenAllowedGqlOperations: ['entitlement'],
};

const mosaicTestingIpHeader = 'mosaic-testing-ip';

// registration of domain plugins will happen in modules root and this file will only look there, but not a level higher
export const buildPostgraphileOptions = (
  config: Config,
  ownerPool: OwnerPgPool,
  authConfig?: AuthenticationConfig,
): PostGraphileOptions<Request, Response> => {
  const logger = new Logger({ config, context: buildPostgraphileOptions.name });
  let options = new PostgraphileOptionsBuilder()
    .setDefaultSettings(config.isDev, config.graphqlGuiEnabled)
    .setErrorsHandler((errors, req) => {
      return enhanceGraphqlErrors(
        errors,
        req.body.operationName,
        customizeGraphQlErrorFields(defaultPgErrorMapper),
        logGraphQlError(entitlementLogMapper),
      );
    })
    .setPgSettings(async () => ({ role: config.dbGqlRole }))
    .addPlugins(
      PgSimplifyInflectorPlugin,
      ConnectionFilterPlugin,
      EntitlementEndpointPlugin,
      AxGuardPlugin,
      AddErrorCodesEnumPluginFactory([
        MosaicErrors,
        WebhookErrors,
        IdGuardErrors,
        CommonErrors,
      ]),
    )
    .addGraphileBuildOptions({
      pgSkipInstallingWatchFixtures: true,
      connectionFilterRelations: true,
      endUserAuthorizationConfig,
    })
    .setAdditionalGraphQLContextFromRequest(async (req, res) => {
      const { subject, authErrorInfo } = await getEndUserAuthenticationContext(
        req,
        authConfig,
      );
      let clientIpAddress = req.ip;
      // This is done for local and test environment testing of being located in different countries
      const mosaicTestingIp = req.headers[mosaicTestingIpHeader] as string;
      if (
        config.mosaicTestingIpEnabled &&
        !isNullOrWhitespace(mosaicTestingIp)
      ) {
        clientIpAddress = mosaicTestingIp;
        res.setHeader('mosaic-client-ip-address', clientIpAddress);
        res.setHeader('mosaic-request-ip-address', req.ip);
        logger.debug({
          message:
            'Debug info on IP-related request information. This is helpful to make sure that correct ip address is being populated by Kubernetes or other proxy.',
          details: {
            reqIp: req.ip,
            headers: req.headers,
          },
        });
      }

      const extendedRequest = req as Request & { token: string };
      const result: ExtendedGraphQLContext = {
        subject,
        authErrorInfo,
        config,
        ownerPool,
        clientIpAddress,
        jwtToken: extendedRequest?.token,
      };
      return result;
    });

  options = setCustomCorsHeaders(options);
  return options.build();
};

/**
 * Used to set custom CORS headers since the standard PostGraphile CORS headers which are added
 * via the { `enableCors`: true } property in the buildPostgraphileOptions is not customizable
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
        mosaicTestingIpHeader, // allow the custom header used for testing purposes
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
