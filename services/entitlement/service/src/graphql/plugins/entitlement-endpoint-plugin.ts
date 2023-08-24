import {
  getMappedError,
  isNullOrWhitespace,
  MosaicError,
} from '@axinom/mosaic-service-common';
import { lookup } from 'geoip-country';
import { gql, makeExtendSchemaPlugin } from 'graphile-utils';
import { CommonErrors } from '../../common';
import {
  generateEntitlementMessageJwt,
  getEntityType,
  getSubscriptionPlanId,
  getVideoKeyIds,
  validateUserClaims,
} from './entitlement-endpoint';
import { getValidatedExtendedContext } from './extended-graphql-context';

/**
 * Plugin that adds a custom graphql endpoint `entitlement` which checks if
 * current user is entitled to view the video and returns an entitlement message
 * to be passed to DRM License Service.
 *
 * @param additionalGraphQLContextFromRequest should be of type `Record<string,
 * any> & { config: Config, clientIpAddress: string, ownerPool: Pool, jwtToken:
 * string }`
 */
export const EntitlementEndpointPlugin = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      input EntitlementInput {
        entityId: String!
        allowPersistence: Boolean
      }
      type EntitlementPayload {
        entitlementMessageJwt: String
        claims: [String!]!
      }
      extend type Query {
        entitlement(input: EntitlementInput): EntitlementPayload
      }
    `,
    resolvers: {
      Query: {
        entitlement: async (_query, args, context) => {
          try {
            const { config, clientIpAddress, ownerPool, jwtToken } =
              getValidatedExtendedContext(context);

            const countryCode = lookup(clientIpAddress)?.country;

            if (isNullOrWhitespace(countryCode)) {
              throw new MosaicError({
                ...CommonErrors.UnableToPlaybackVideo,
                details: {
                  hint: 'The location of the user could not be confirmed based on his IP address.',
                  clientIpAddress,
                },
              });
            }

            const type = getEntityType(args.input.entityId);
            const keyIds = await getVideoKeyIds(
              type,
              args.input.entityId,
              config.catalogServiceBaseUrl,
              countryCode,
            );
            const subscriptionPlanId = await getSubscriptionPlanId(
              config.billingServiceBaseUrl,
              jwtToken,
            );
            const claims = await validateUserClaims(
              subscriptionPlanId,
              type,
              countryCode,
              args.input.allowPersistence,
              ownerPool,
            );
            const entitlementMessageJwt = generateEntitlementMessageJwt(
              keyIds,
              claims,
              config,
              config.isDev ? 'DEV' : 'DEFAULT',
            );
            return { entitlementMessageJwt, claims };
          } catch (error) {
            throw getMappedError(error);
          }
        },
      },
    },
  };
});
