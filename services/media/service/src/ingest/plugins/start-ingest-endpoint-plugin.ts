/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  buildPgSettings,
  transactionWithContext,
} from '@axinom/mosaic-db-common';
import { MosaicError } from '@axinom/mosaic-service-common';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { ReadStream } from 'fs';
import { gql as gqlExtended, makeExtendSchemaPlugin } from 'graphile-utils';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import {
  IngestDocument,
  MediaServiceMessagingSettings,
  StartIngestCommand,
} from 'media-messages';
import { Build } from 'postgraphile';
import { Stream } from 'stream';
import { insert, IsolationLevel } from 'zapatos/db';
import {
  CommonErrors,
  getLongLivedToken,
  getMediaMappedError,
  transformAjvErrors,
} from '../../common';
import { ingestPermissionMappings } from '../../domains/permission-definition';
import { ExtendedGraphQLContext } from '../../graphql';
import * as ingestSchema from '../schemas/ingest-validation-schema.json';
import { customIngestValidation } from '../utils';

function streamToString(stream: Stream): Promise<string> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

function checkPermissions(
  document: IngestDocument,
  subjectPermissions: string[] | undefined,
): void {
  if (subjectPermissions === undefined || subjectPermissions.length === 0) {
    throw new MosaicError({
      message: 'The subject has no permission to access this service.',
      code: CommonErrors.NotEnoughPermissions.code,
    });
  }

  for (const mapping of ingestPermissionMappings) {
    if (
      document.items.some((item) => item.type === mapping.type) &&
      !mapping.permissions.some((p) => subjectPermissions.includes(p))
    ) {
      throw new MosaicError({
        message: `The subject has no permission to mutate '${mapping.type}' entities.`,
        code: CommonErrors.NotEnoughPermissions.code,
      });
    }
  }
}

const getDocumentPgField = async (
  id: number,
  { pgSql }: Build,
  graphile: GraphileHelpers<any>,
): Promise<any> => {
  const [row] = await graphile.selectGraphQLResultFromTable(
    pgSql.fragment`app_public.ingest_documents`,
    (tableAlias, queryBuilder) => {
      queryBuilder.where(pgSql.fragment`${tableAlias}.id = ${pgSql.value(id)}`);
    },
  );
  return row;
};

/**
 * Plugin that adds a custom graphql endpoint `startIngest` which starts ingest process by uploading an ingest document JSON file.
 *
 * @param additionalGraphQLContextFromRequest should be of type `Record<string, any> & { config: Config, subject: AuthenticatedManagementSubject, ownerPool: Pool, messagingBroker: Broker, jwtToken: string }`
 */
export const StartIngestEndpointPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gqlExtended`
      input StartIngestInput {
        file: Upload!
      }
      type StartIngestPayload {
        ingestDocument: IngestDocument @pgField
        query: Query
      }
      extend type Mutation {
        startIngest(input: StartIngestInput!): StartIngestPayload
      }
    `,
    resolvers: {
      Mutation: {
        startIngest: async (
          _query,
          args,
          context: ExtendedGraphQLContext,
          { graphile },
        ) => {
          try {
            const file = await args.input.file;
            const stream: ReadStream = file.createReadStream();
            const documentString = await streamToString(stream);
            const document: IngestDocument = JSON.parse(documentString);

            checkPermissions(
              document,
              context.subject?.permissions[context.config.serviceId],
            );

            const pgSettings = buildPgSettings(
              context.subject,
              context.config.dbGqlRole ?? 'undefined',
              context.config.serviceId,
            );

            const ajv = new Ajv({ allErrors: true });
            addFormats(ajv);
            const isValid = ajv.validate(ingestSchema, document);
            const customErrors = customIngestValidation(document);
            if (!isValid || customErrors.length > 0) {
              const schemaErrors = transformAjvErrors(
                ajv.errors,
                documentString,
              );
              throw new MosaicError({
                ...CommonErrors.IngestValidationError,
                details: {
                  validationErrors: [...schemaErrors, ...customErrors],
                },
              });
            }

            // Token retrieved here to make sure that if error is thrown - document is not created
            const token = await getLongLivedToken(
              context.jwtToken ?? '',
              context.config,
            );

            // A new transaction is started and committed to make sure the ingest
            // document exists before the 'StartIngestCommand' message is published.
            const doc = await transactionWithContext(
              context.ownerPool,
              IsolationLevel.Serializable,
              pgSettings,
              async (ctx) => {
                return insert('ingest_documents', {
                  name: document.name,
                  title: document.name,
                  document: document,
                  document_created: document.document_created,
                  items_count: document.items.length,
                  in_progress_count: document.items.length,
                }).run(ctx);
              },
            );

            // Sending only a database ID in a scenario of detached services is an anti-pattern
            // Ideally the whole doc should have been sent and message should be self-contained,
            // but because the document can be quite big we save it to DB and pass only it's ID.
            await context.messagingBroker.publish<StartIngestCommand>(
              MediaServiceMessagingSettings.StartIngest.messageType,
              { doc_id: doc.id },
              { auth_token: token },
            );

            const data = await getDocumentPgField(doc.id, build, graphile);
            return { data, query: build.$$isQuery };
          } catch (error) {
            throw getMediaMappedError(error);
          }
        },
      },
    },
  };
});
