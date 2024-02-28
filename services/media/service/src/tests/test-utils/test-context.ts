import {
  buildPgSettings,
  compareMigrationHashes,
  LoginPgPool,
  MigrationRecord,
  OwnerPgPool,
  runCurrentSql,
  transactionWithContext,
} from '@axinom/mosaic-db-common';
import { enhanceGraphqlErrors } from '@axinom/mosaic-graphql-common';
import {
  AuthenticatedManagementSubject,
  ManagementAuthenticationContext,
} from '@axinom/mosaic-id-guard';
import {
  assertError,
  customizeGraphQlErrorFields,
  defaultWriteLogMapper,
  Dict,
  GraphQLErrorEnhanced,
  Logger,
  logGraphQlError,
  MosaicError,
  MosaicErrors,
} from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Request, Response } from 'express';
import { migrate } from 'graphile-migrate';
import { DocumentNode, graphql, GraphQLSchema } from 'graphql';
import { print } from 'graphql/language/printer';
import { mockRequest, mockResponse } from 'mock-req-res';
import { resolve } from 'path';
import { Pool } from 'pg';
import {
  createPostGraphileSchema,
  PostGraphileOptions,
  withPostGraphileContext,
} from 'postgraphile';
import { IsolationLevel, truncate, TxnClient } from 'zapatos/db';
import { Table } from 'zapatos/schema';
import { Config, getMigrationSettings, mediaPgErrorMapper } from '../../common';
import { buildPostgraphileOptions } from '../../graphql/postgraphile-options';
import { createTestConfig } from './test-config';
import { createTestUser } from './test-user';

interface IExecutionResult {
  errors?: readonly GraphQLErrorEnhanced[];
  data?: Dict<any>;
}

const runGqlQuery = async function (
  this: ITestContext,
  query: string | DocumentNode,
  variables: Dict<any> = {},
  requestContext: Dict<any> = {},
): Promise<IExecutionResult> {
  const queryString = typeof query === 'string' ? query : print(query);
  const req = mockRequest({
    body: { query: queryString },
    authContext: {},
    socket: {},
    ...requestContext,
  });
  const res = mockResponse();
  const pgSettings =
    (typeof this.options.pgSettings === 'function'
      ? await this.options.pgSettings(req)
      : this.options.pgSettings) || {};
  return withPostGraphileContext(
    {
      ...this.options,
      pgPool: this.loginPool,
      pgSettings,
    },
    async (context) => {
      const additionalContext =
        await this.options?.additionalGraphQLContextFromRequest?.(req, res);
      const result = await graphql(
        this.schema,
        queryString,
        null,
        {
          ...context,
          ...additionalContext,
        },
        variables,
      );

      // Transform errors
      if (result.errors) {
        result.errors = enhanceGraphqlErrors(
          result.errors,
          req.body?.operationName,
          customizeGraphQlErrorFields(mediaPgErrorMapper),
          logGraphQlError(defaultWriteLogMapper, this.logger),
        );
      }
      return result;
    },
  ) as IExecutionResult;
};

export interface ITestContext {
  ownerPool: OwnerPgPool;
  loginPool: LoginPgPool;
  config: Config;
  logger: Logger;
  options: PostGraphileOptions<Request, Response>;
  schema: GraphQLSchema;
  truncate: (tableName: Table) => Promise<void>;
  dispose: () => Promise<void>;
  runGqlQuery(
    query: string | DocumentNode,
    variables?: Dict<any>,
    requestContext?: TestRequestContext,
  ): Promise<IExecutionResult>;
  executeGqlSql<T>(
    user: AuthenticatedManagementSubject,
    callback: (client: TxnClient<IsolationLevel>) => Promise<T>,
  ): Promise<T>;
}

export interface TestRequestContext {
  authContext: ManagementAuthenticationContext;
  token?: string;
}

export const createTestRequestContext = (
  serviceId: string,
  subject?: AuthenticatedManagementSubject,
): TestRequestContext => {
  return {
    authContext: {
      subject: subject ?? createTestUser(serviceId),
    },
    token: 'mock_token',
  };
};

export const createTestContext = async (
  configOverrides: Dict<string> = {},
  storeOutboxMsg?: StoreOutboxMessage,
): Promise<ITestContext> => {
  //This is needed if tests are running from monorepo context instead of project context, e.g. using Jest Runner extension
  process.chdir(resolve(__dirname, '../../../'));

  //TODO: Check expect.getState().testPath filename for .db.spec. convention, throw an error if it does not match. https://github.com/facebook/jest/issues/9901
  const config = createTestConfig(configOverrides, expect.getState().testPath);

  const settings = await getMigrationSettings(config);
  const logger = new Logger({ config, context: 'TestContext' });
  await compareMigrationHashes(
    settings,
    (message: string, mismatchedRecords?: MigrationRecord[]): void => {
      const details: Dict<unknown> = {};
      if (mismatchedRecords) {
        mismatchedRecords.map((rec) => {
          details[rec.filename] = rec;
        });
      }
      throw new MosaicError({
        message,
        code: MosaicErrors.StartupError.code,
        details,
      });
    },
  );
  await migrate(settings);
  await runCurrentSql(settings, logger);

  const ownerPool = new Pool({
    connectionString: config.dbOwnerConnectionString,
  }) as OwnerPgPool;
  ownerPool.label = 'Owner';

  const loginPool = new Pool({
    connectionString: config.dbLoginConnectionString,
  }) as LoginPgPool;
  loginPool.label = 'Login';

  const options = buildPostgraphileOptions(
    config,
    ownerPool,
    storeOutboxMsg ?? jest.fn(),
  );

  const schema = await createPostGraphileSchema(
    loginPool,
    'app_public',
    options,
  );

  const executeGqlSql = async <T>(
    user: AuthenticatedManagementSubject,
    callback: (client: TxnClient<IsolationLevel>) => Promise<T>,
  ): Promise<T> => {
    const pgSettings = buildPgSettings(
      user,
      config.dbGqlRole,
      config.serviceId,
    );
    return transactionWithContext(
      loginPool,
      IsolationLevel.Serializable,
      pgSettings,
      async (dbContext) => callback(dbContext),
    );
  };

  return {
    ownerPool,
    loginPool,
    config,
    logger,
    options,
    schema,
    runGqlQuery,
    truncate: async function (tableName: Table): Promise<void> {
      try {
        await truncate(tableName, 'CASCADE').run(this.ownerPool);
      } catch (e) {
        assertError(e);
        this.logger.error(
          e,
          'An error occurred while trying to truncate a table using TestContext.',
        );
      }
    },
    dispose: async function (): Promise<void> {
      try {
        await this.ownerPool.end();
        await this.loginPool.end();
      } catch (e) {
        assertError(e);
        this.logger.error(
          e,
          'An error occurred while trying to dispose pg pools using TestContext.',
        );
      }
    },
    executeGqlSql,
  } as ITestContext;
};
