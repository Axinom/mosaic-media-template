import {
  AuthenticatedManagementRequest,
  handleManagementUserAuthorization,
} from '@axinom/mosaic-id-guard';
import { GqlAuthorizationOptions } from '@axinom/mosaic-id-guard/dist/common/guard-utils';
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { AuthenticationError } from 'apollo-server-express';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { permissionDefinition } from './permission-definitions';

import { EndUserAuthorizationConfig } from '@axinom/mosaic-id-utils';
import { Config } from '../config';

export const CheckAuthorizationDirectiveTransformer = (
  config: Config,
  directiveName: string,
): ((schema: GraphQLSchema) => GraphQLSchema) => {
  return (schema) =>
    mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const { resolve = defaultFieldResolver } = fieldConfig;
        return {
          ...fieldConfig,
          resolve: async (source, args, context, info) => {
            const result = await resolve(source, args, context, info);
            const authDirective = getDirective(
              schema,
              fieldConfig,
              directiveName,
            );
            if (authDirective) {
              const authContext = (context as AuthenticatedManagementRequest)
                .authContext;
              if (authContext.authErrorInfo) {
                throw new AuthenticationError(
                  authContext.authErrorInfo.message,
                );
              }

              const endUserAuthorizationConfig: EndUserAuthorizationConfig = {
                anonymousGqlOperations: [],
                applicationTokenAllowedGqlOperations: [],
              };
              const authOptions: GqlAuthorizationOptions = {
                serviceId: config.serviceId,
                operation: info.fieldName,
                permissionDefinition: permissionDefinition,
                endUserAuthorizationConfig: endUserAuthorizationConfig,
              };

              handleManagementUserAuthorization(
                authOptions,
                false,
                authContext.subject,
                authContext.authErrorInfo,
              );
            }
            return result;
          },
        };
      },
    });
};
