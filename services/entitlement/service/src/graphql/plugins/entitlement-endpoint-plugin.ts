import {
  getMappedError,
  isNullOrWhitespace,
  MosaicError,
} from '@axinom/mosaic-service-common';
import { gql, makeExtendSchemaPlugin } from 'graphile-utils';
import maxmind, { CountryResponse, Reader } from 'maxmind';
import path from 'path';
import { CommonErrors } from '../../common';
import { ENABLE_VIDEOS_DOWNLOAD, validClaims } from '../../domains';
import {
  generateEntitlementMessageJwt,
  getEntityType,
  getVideoKeyIds,
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

            const geoLookup = await getGeoLookup();
            const countryCode =
              geoLookup?.get(clientIpAddress)?.country?.iso_code;

            if (isNullOrWhitespace(countryCode)) {
              throw new MosaicError({
                ...CommonErrors.UnableToPlaybackVideo,
                logInfo: {
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

            /*
              Implement your custom logic to retrieve the correct set of `claims` for the user.
              For example, this can be based on an active subscription plan for the user or
              the payload of the user auth token, etc.
             
              The actual implementation of how to retrieve the claims is subjective to your business logic.
              For demonstration purposes, we will assume that the user will always have the claims hardcoded as below.
            */

            const claims = validClaims.filter(
              (claim) =>
                claim !== ENABLE_VIDEOS_DOWNLOAD ||
                (claim === ENABLE_VIDEOS_DOWNLOAD &&
                  type !== 'channel' &&
                  args.input.allowPersistence), // Allow download only for entity types other than 'channel' and if explicitly requested
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

let geoLookupPromise: Promise<Reader<CountryResponse>> | null = null;

const getGeoLookup = async (): Promise<Reader<CountryResponse>> => {
  const geoDbPath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'GeoLite2-Country.mmdb',
  );

  if (!geoLookupPromise) {
    geoLookupPromise = maxmind.open<CountryResponse>(geoDbPath);
  }
  return geoLookupPromise;
};
