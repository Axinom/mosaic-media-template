import { getMappedError, Logger } from '@axinom/mosaic-service-common';
import { Plugin } from 'graphile-build';
import { gql, makeExtendSchemaPlugin } from 'graphile-utils';
import { getValidatedExtendedContext } from '../../../graphql/models';
import { validateChannel } from '../publishing';

const logger = new Logger({
  context: 'validate-channel-plugin',
});

export const ValidateChannelPlugin: Plugin = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      type ValidationChannelPayload {
        """
        List of validation messages.
        """
        validationMessages: [PublishValidationMessage!]!
        """
        Status of channel validation.
        """
        validationStatus: PublishValidationStatus!
        """
        Hash of the channel payload for publication.
        """
        publishHash: String

        query: Query
      }
      extend type Query {
        """
        Validate a channel prior to publication.
        """
        validateChannel(id: UUID!): ValidationChannelPayload
      }
    `,
    resolvers: {
      Query: {
        validateChannel: async (
          _query,
          { id },
          context,
          { graphile: { build } },
        ) => {
          try {
            const { jwtToken, config, pgClient } =
              getValidatedExtendedContext(context);
            logger.debug(`Validating channel with ID '${id}'`);

            const { validations, validationStatus, publishHash } =
              await validateChannel(id, jwtToken, pgClient, config);

            logger.debug({
              message: `Channel with ID '${id}' validation result:`,
              details: {
                validations,
                validationStatus,
                publishHash,
              },
            });

            return {
              validationMessages: validations,
              validationStatus,
              publishHash: validationStatus === 'ERRORS' ? null : publishHash,
              query: build.$$isQuery,
            };
          } catch (error) {
            throw getMappedError(error);
          }
        },
      },
    },
  };
});
