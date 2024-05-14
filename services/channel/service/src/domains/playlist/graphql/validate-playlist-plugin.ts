import { getMappedError, Logger } from '@axinom/mosaic-service-common';
import { Plugin } from 'graphile-build';
import { gql, makeExtendSchemaPlugin } from 'graphile-utils';
import { getValidatedExtendedContext } from '../../../graphql/models';
import { validatePlaylist } from '../publishing';
const logger = new Logger({
  context: 'validate-playlist-plugin',
});

export const ValidatePlaylistPlugin: Plugin = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      type ValidationPlaylistPayload {
        """
        List of validation messages.
        """
        validationMessages: [PublishValidationMessage!]!
        """
        Status of playlist validation.
        """
        validationStatus: PublishValidationStatus!
        """
        Hash of the playlist payload for publication.
        """
        publishHash: String

        query: Query
      }
      extend type Query {
        """
        Validate a playlist prior to publication.
        """
        validatePlaylist(id: UUID!): ValidationPlaylistPayload
      }
    `,
    resolvers: {
      Query: {
        validatePlaylist: async (
          _query,
          { id },
          context,
          { graphile: { build } },
        ) => {
          try {
            const { subject, jwtToken, config, pgClient } =
              getValidatedExtendedContext(context);
            logger.debug(`Validating playlist with ID '${id}'`);

            const { validations, validationStatus, publishHash } =
              await validatePlaylist(id, jwtToken, pgClient, config);

            logger.debug({
              message: `Playlist with ID '${id}' validation result:`,
              details: {
                validations,
                publishHash,
                validationStatus,
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
