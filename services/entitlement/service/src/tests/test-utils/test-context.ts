import {
  compareMigrationHashes,
  LoginPgPool,
  MigrationRecord,
  OwnerPgPool,
  runCurrentSql,
} from '@axinom/mosaic-db-common';
import { EndUserAuthenticationContext } from '@axinom/mosaic-id-guard';
import {
  assertError,
  defaultPgErrorMapper,
  Dict,
  GraphQLErrorEnhanced,
  graphqlErrorsHandler,
  Logger,
  MosaicError,
  MosaicErrors,
} from '@axinom/mosaic-service-common';
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
import { truncate } from 'zapatos/db';
import { Table } from 'zapatos/schema';
import { Config, getMigrationSettings } from '../../common';
import { entitlementLogMapper } from '../../common/errors/entitlement-log-mapper';
import { buildPostgraphileOptions } from '../../graphql/postgraphile-options';
import { createTestConfig } from './test-config';

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
    headers: {},
    ip: '',
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
        result.errors = graphqlErrorsHandler(
          result.errors,
          defaultPgErrorMapper,
          entitlementLogMapper,
          this.logger,
        );
      }
      return result;
    },
  ) as IExecutionResult;
};
export interface TestRequestContext {
  headers?: Dict<string>;
  ip?: string;
  authContext: EndUserAuthenticationContext;
}

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
}

export const createTestContext = async (
  configOverrides: Dict<string> = {},
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

  const options = buildPostgraphileOptions(config, ownerPool);

  const schema = await createPostGraphileSchema(
    loginPool,
    'app_public',
    options,
  );

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
  } as ITestContext;
};
