import { DEFAULT_SYSTEM_USERNAME } from '@axinom/mosaic-db-common';
import {
  ImageServiceMultiTenantMessagingSettings,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { assertNotFalsy } from '@axinom/mosaic-service-common';
import { createReadStream, readFileSync, ReadStream } from 'fs';
import { Upload } from 'graphql-upload';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { MediaServiceMessagingSettings } from 'media-messages';
import { resolve } from 'path';
import { Readable } from 'stream';
import { all, conditions as c, insert, select } from 'zapatos/db';
import {
  episodes,
  episodes_licenses,
  ingest_documents,
  movies,
  movies_licenses,
  movie_genres,
  seasons,
  seasons_licenses,
  seasons_production_countries,
  tvshows_licenses,
  tvshows_production_countries,
  tvshow_genres,
} from 'zapatos/schema';
import { getLongLivedToken } from '../../common/utils/token-utils';
import { getIngestProcessors } from '../../domains/get-ingest-processors';
import {
  CheckFinishIngestDocumentHandler,
  StartIngestHandler,
  StartIngestItemHandler,
  UpdateMetadataHandler,
  VideoCreationStartedHandler,
} from '../../ingest';
import { ImageCreatedHandler } from '../../ingest/handlers/image-created-handler';
// mock the long lived token call to not call the ID service
import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import {
  InboxMessageMetadata,
  StoreInboxMessage,
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  createTestContext,
  createTestRequestContext,
  createTestUser,
  ITestContext,
  TestRequestContext,
} from '../test-utils';
import { START_INGEST } from './gql-constants';

// mock the long lived token call to not call the ID service
jest.mock('../../common/utils/token-utils');
const getLongLivedTokenMock = getLongLivedToken as jest.MockedFunction<
  typeof getLongLivedToken
>;
getLongLivedTokenMock.mockReturnValue(Promise.resolve('some token'));

// Avoid waiting for 5 seconds to re-calculate document status and counts
jest.mock('@axinom/mosaic-service-common', () => {
  const original = jest.requireActual('@axinom/mosaic-service-common');
  return {
    ...original,
    sleep: jest.fn(),
  };
});

const stringToStream = (value: string): Readable => {
  const stream = new Readable();
  stream.push(Buffer.from(value, 'utf8'));
  stream.push(null);

  return stream;
};

describe('Movies GraphQL endpoints', () => {
  let ctx: ITestContext;
  let user: AuthenticatedManagementSubject;
  let storeOutboxMessage: StoreOutboxMessage;
  let storeInboxMessage: StoreInboxMessage;
  let startIngest: StartIngestHandler;
  let startItem: StartIngestItemHandler;
  let updateMetadata: UpdateMetadataHandler;
  let videoCreationStarted: VideoCreationStartedHandler;
  let imageCreated: ImageCreatedHandler;
  let checkFinishDocument: CheckFinishIngestDocumentHandler;
  let messages: {
    messageType: string;
    payload: any;
    envelopeOverrides: InboxMessageMetadata | undefined;
  }[] = []; // We don't care about message types in this context, we just redirect what was sent
  let defaultRequestContext: TestRequestContext;
  let movieGenres: movie_genres.JSONSelectable[];
  let tvshowGenres: tvshow_genres.JSONSelectable[];

  const createMessage = <T>(
    payload: any,
    metadata: InboxMessageMetadata | undefined,
  ) =>
    stub<TypedTransactionalMessage<T>>({
      payload,
      metadata,
    });

  beforeAll(async () => {
    storeOutboxMessage = jest.fn(
      async (_aggregateId, { messageType }, payload, _client, optionalData) => {
        const { envelopeOverrides } = optionalData || {};
        messages.push({
          messageType,
          payload,
          envelopeOverrides: {
            authToken: envelopeOverrides?.auth_token,
            messageContext: envelopeOverrides?.message_context,
          },
        });
      },
    );
    storeInboxMessage = jest.fn(
      async (_aggregateId, { messageType }, payload, _client, optionalData) => {
        const { metadata } = optionalData || {};
        messages.push({
          messageType,
          payload,
          envelopeOverrides: metadata,
        });
      },
    );
    ctx = await createTestContext({}, storeOutboxMessage, storeInboxMessage);
    user = createTestUser(ctx.config.serviceId);
    const subject = createTestUser(ctx.config.serviceId, {
      permissions: {
        'ax-image-service': ['IMAGES_EDIT', 'IMAGES_VIEW'],
        [ctx.config.serviceId]: [
          'INGESTS_VIEW',
          'MOVIES_VIEW',
          'TVSHOWS_VIEW',
          'SETTINGS_VIEW',
          'INGESTS_EDIT',
          'MOVIES_EDIT',
          'TVSHOWS_EDIT',
        ],
        'ax-video-service': ['VIDEOS_EDIT'],
      },
    });
    defaultRequestContext = createTestRequestContext(
      ctx.config.serviceId,
      subject,
    );
    const ingestProcessors = getIngestProcessors(ctx.config);
    startIngest = new StartIngestHandler(
      ingestProcessors,
      storeInboxMessage,
      ctx.ownerPool,
      ctx.config,
    );

    startItem = new StartIngestItemHandler(
      ingestProcessors,
      storeInboxMessage,
      storeOutboxMessage,
      ctx.config,
    );

    updateMetadata = new UpdateMetadataHandler(ingestProcessors, ctx.config);

    videoCreationStarted = new VideoCreationStartedHandler(
      ingestProcessors,
      ctx.config,
    );

    imageCreated = new ImageCreatedHandler(ingestProcessors, ctx.config);

    checkFinishDocument = new CheckFinishIngestDocumentHandler(
      storeInboxMessage,
      ctx.config,
    );

    movieGenres = await insert('movie_genres', [
      { title: 'Sci-Fi', sort_order: 1 },
      { title: 'Animation', sort_order: 2 },
    ]).run(ctx.ownerPool);

    tvshowGenres = await insert('tvshow_genres', [
      { title: 'Action', sort_order: 1 },
      { title: 'Adventure', sort_order: 2 },
      { title: 'Sci-Fi', sort_order: 3 },
    ]).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('ingest_documents');
    await ctx.truncate('movies');
    await ctx.truncate('episodes');
    await ctx.truncate('seasons');
    await ctx.truncate('tvshows');
    messages = [];
  });

  afterAll(async () => {
    await ctx.truncate('movie_genres');
    await ctx.truncate('tvshow_genres');
    await ctx.dispose();
  });

  describe('startIngest', () => {
    it.each([
      'documents/minimal-valid-movie.json',
      'documents/movie-without-videos.json',
    ])('upload a json file %p -> document is created', async (filePath) => {
      // Arrange
      const file = createReadStream(resolve(__dirname, filePath));

      const upload = new Upload();
      upload.promise = new Promise((resolve) =>
        resolve({
          filename: 'valid-movie.json',
          mimetype: 'application/json',
          encoding: 'UTF-8',
          createReadStream: () => file,
        }),
      );

      // Act
      const resp = await ctx.runGqlQuery(
        START_INGEST,
        { input: { file: upload } },
        defaultRequestContext,
      );

      // Assert
      assertNotFalsy(resp.data, 'resp.data');

      expect(resp.errors).toBeFalsy();

      const doc = resp.data.startIngest.ingestDocument;
      expect(doc.id).toBeTruthy();
      expect(doc.document.name).toBe('Test Ingest');
      expect(doc.itemsCount).toBe(doc.document.items.length);
    });

    it('upload an invalid json file with json validation error -> document is not created and error is returned', async () => {
      // Arrange
      const file = createReadStream(
        resolve(__dirname, 'documents/movie-without-title.json'),
      );

      const upload = new Upload();
      upload.promise = new Promise((resolve) =>
        resolve({
          filename: 'movie-without-title.json',
          mimetype: 'application/json',
          encoding: 'UTF-8',
          createReadStream: () => file,
        }),
      );

      // Act
      const resp = await ctx.runGqlQuery(
        START_INGEST,
        { input: { file: upload } },
        defaultRequestContext,
      );

      // Assert
      assertNotFalsy(resp.data, 'resp.data');
      assertNotFalsy(resp.errors, 'resp.errors');

      expect(resp.data.startIngest).toBeFalsy();
      expect(resp.errors[0]).toMatchObject({
        timestamp: resp.errors[0].timestamp,
        message: 'Ingest Document validation has failed.',
        code: 'INGEST_VALIDATION_ERROR',
        details: {
          validationErrors: [
            {
              message:
                'JSON path "document/items/0/data" should have required property \'title\' (line: 7, column: 15)',
              schemaPath:
                '#/properties/items/items/allOf/0/then/properties/data/required',
              type: 'JsonSchemaValidation',
            },
            {
              message:
                'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
              schemaPath: '#/properties/items/items/allOf/0/if',
              type: 'JsonSchemaValidation',
            },
          ],
        },
        path: ['startIngest'],
      });

      // If validation has failed - no messages are sent and no document is created
      const docs = await select('ingest_documents', all).run(ctx.ownerPool);
      expect(messages).toEqual([]);
      expect(docs).toHaveLength(0);
    });

    it('upload an invalid single-line json -> document is not created and error is returned with line 1 and correct column', async () => {
      // Arrange
      const file = stringToStream(
        '{ "name": "Test Ingest", "items": [ { "type": "MOVIE", "external_id": "avatar67A23", "data": { } } ] }',
      );

      const upload = new Upload();
      upload.promise = new Promise((resolve) =>
        resolve({
          filename: 'single-line-json.json',
          mimetype: 'application/json',
          encoding: 'UTF-8',
          createReadStream: () => file as ReadStream,
        }),
      );

      // Act
      const resp = await ctx.runGqlQuery(
        START_INGEST,
        { input: { file: upload } },
        defaultRequestContext,
      );

      // Assert
      assertNotFalsy(resp.data, 'resp.data');
      assertNotFalsy(resp.errors, 'resp.errors');

      expect(resp.data.startIngest).toBeFalsy();
      expect(resp.errors[0]).toMatchObject({
        timestamp: resp.errors[0].timestamp,
        message: 'Ingest Document validation has failed.',
        code: 'INGEST_VALIDATION_ERROR',
        details: {
          validationErrors: [
            {
              message:
                'JSON path "document/items/0/data" should have required property \'title\' (line: 1, column: 94)',
              schemaPath:
                '#/properties/items/items/allOf/0/then/properties/data/required',
              type: 'JsonSchemaValidation',
            },
            {
              message:
                'JSON path "document/items/0" should match "then" schema (line: 1, column: 37)',
              schemaPath: '#/properties/items/items/allOf/0/if',
              type: 'JsonSchemaValidation',
            },
          ],
        },
        path: ['startIngest'],
      });

      // If validation has failed - no messages are sent and no document is created
      const docs = await select('ingest_documents', all).run(ctx.ownerPool);
      expect(messages).toEqual([]);
      expect(docs).toHaveLength(0);
    });

    it('upload an invalid json file with custom and json validation errors -> document is not created and schema errors are returned', async () => {
      // Arrange
      const file = createReadStream(
        resolve(__dirname, 'documents/invalid-movie-for-custom-errors.json'),
      );

      const upload = new Upload();
      upload.promise = new Promise((resolve) =>
        resolve({
          filename: 'invalid-movie-for-custom-errors.json',
          mimetype: 'application/json',
          encoding: 'UTF-8',
          createReadStream: () => file,
        }),
      );

      // Act
      const resp = await ctx.runGqlQuery(
        START_INGEST,
        { input: { file: upload } },
        defaultRequestContext,
      );

      // Assert
      assertNotFalsy(resp.data, 'resp.data');
      assertNotFalsy(resp.errors, 'resp.errors');

      expect(resp.data.startIngest).toBeFalsy();
      expect(resp.errors[0]).toMatchObject({
        timestamp: resp.errors[0].timestamp,
        message: 'Ingest Document validation has failed.',
        code: 'INGEST_VALIDATION_ERROR',
        details: {
          validationErrors: [
            {
              message:
                'JSON path "document/items/0/data" should have required property \'title\' (line: 7, column: 15)',
              schemaPath:
                '#/properties/items/items/allOf/0/then/properties/data/required',
              type: 'JsonSchemaValidation',
            },
            {
              message:
                'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
              schemaPath: '#/properties/items/items/allOf/0/if',
              type: 'JsonSchemaValidation',
            },
            {
              message:
                'JSON path "document/items/1" should have required property \'data\' (line: 33, column: 5)',
              schemaPath: '#/properties/items/items/required',
              type: 'JsonSchemaValidation',
            },
          ],
        },
        path: ['startIngest'],
      });

      // If validation has failed - no messages are sent and no document is created
      const docs = await select('ingest_documents', all).run(ctx.ownerPool);
      expect(messages).toEqual([]);
      expect(docs).toHaveLength(0);
    });

    it('upload an invalid json file with custom error -> document is not created and error is returned', async () => {
      // Arrange
      const file = createReadStream(
        resolve(__dirname, 'documents/duplicate-movie-external-ids.json'),
      );

      const upload = new Upload();
      upload.promise = new Promise((resolve) =>
        resolve({
          filename: 'duplicate-movie-external-ids.json',
          mimetype: 'application/json',
          encoding: 'UTF-8',
          createReadStream: () => file,
        }),
      );

      // Act
      const resp = await ctx.runGqlQuery(
        START_INGEST,
        { input: { file: upload } },
        defaultRequestContext,
      );

      // Assert
      assertNotFalsy(resp.data, 'resp.data');
      assertNotFalsy(resp.errors, 'resp.errors');

      expect(resp.data.startIngest).toBeFalsy();

      expect(resp.errors[0]).toMatchObject({
        timestamp: resp.errors[0].timestamp,
        message: 'Ingest Document validation has failed.',
        code: 'INGEST_VALIDATION_ERROR',
        details: {
          validationErrors: [
            {
              message:
                'Document has 2 duplicate items with type "MOVIE" and external_id "avatar67A23"',
              type: 'CustomDataValidation',
            },
          ],
        },
        path: ['startIngest'],
      });

      // If validation has failed - no messages are sent and no document is created
      const docs = await select('ingest_documents', all).run(ctx.ownerPool);
      expect(messages).toEqual([]);
      expect(docs).toHaveLength(0);
    });

    it('ingest workflow happy path -> movie with relations is created, ingest document and item are in SUCCESS status', async () => {
      // Arrange
      const filePath = resolve(
        __dirname,
        'documents/all-types-with-videos-and-images.json',
      );
      const file = createReadStream(filePath);

      const upload = new Upload();
      upload.promise = new Promise((resolve) =>
        resolve({
          filename: 'all-types-with-videos-and-images.json',
          mimetype: 'application/json',
          encoding: 'UTF-8',
          createReadStream: () => file,
        }),
      );

      //Act
      const resp = await ctx.runGqlQuery(
        START_INGEST,
        { input: { file: upload } },
        defaultRequestContext,
      );

      let videoId = 1;
      let imageId = 1;
      while (messages.length) {
        const msg = messages.shift();
        assertNotFalsy(msg, 'msg');

        switch (msg.messageType) {
          case MediaServiceMessagingSettings.StartIngest.messageType:
            await ctx.executeOwnerSql(user, async (txn) => {
              await startIngest.handleMessage(
                createMessage(msg.payload, msg.envelopeOverrides),
                txn,
                { subject: user },
              );
            });
            break;
          case MediaServiceMessagingSettings.StartIngestItem.messageType:
            await ctx.executeOwnerSql(user, async (txn) => {
              await startItem.handleMessage(
                createMessage(msg.payload, msg.envelopeOverrides),
                txn,
              );
            });
            break;
          case MediaServiceMessagingSettings.UpdateMetadata.messageType:
            await ctx.executeOwnerSql(user, async (txn) => {
              await updateMetadata.handleMessage(
                createMessage(msg.payload, msg.envelopeOverrides),
                txn,
              );
            });
            break;
          case VideoServiceMultiTenantMessagingSettings.EnsureVideoExists
            .messageType: //EnsureVideoExistsStart is handled in another service, here we will just mock messages from it.
            await ctx.executeOwnerSql(user, async (txn) => {
              await videoCreationStarted.handleMessage(
                createMessage(
                  {
                    ...msg.payload,
                    video_id: `0354c2ac-a6d2-45b4-94dc-0000000000${(
                      '00' + videoId++
                    ).slice(-2)}`,
                  },
                  msg.envelopeOverrides,
                ),
                txn,
              );
            });
            break;
          case ImageServiceMultiTenantMessagingSettings.EnsureImageExists
            .messageType: //EnsureImageExistsStart is handled in another service, here we will just mock messages from it.
            await ctx.executeOwnerSql(user, async (txn) => {
              await imageCreated.handleMessage(
                createMessage(
                  {
                    image_id: `11e1d903-49ed-4d70-8b24-00000000000${imageId++}`,
                  },
                  msg.envelopeOverrides,
                ),
                txn,
              );
            });
            break;
          case MediaServiceMessagingSettings.CheckFinishIngestDocument
            .messageType:
            await ctx.executeOwnerSql(user, async (txn) => {
              await checkFinishDocument.handleMessage(
                createMessage(msg.payload, msg.envelopeOverrides),
                txn,
              );
            });
            break;
          default:
            break;
        }
      }

      // Assert
      expect(resp.errors).toBeFalsy();

      assertNotFalsy(resp.data, 'resp.data');
      expect(resp.data.startIngest.ingestDocument.id).toBeTruthy();

      //Movie
      const movies = await select('movies', all).run(ctx.ownerPool);
      const moviesCasts = await select('movies_casts', all).run(ctx.ownerPool);
      const moviesLicenses = await select('movies_licenses', all).run(
        ctx.ownerPool,
      );
      const moviesLicenseCountries = await select('movies_licenses_countries', {
        movies_license_id: c.isIn(moviesLicenses.map((x) => x.id)),
      }).run(ctx.ownerPool);
      const movieGenreRelations = await select('movies_movie_genres', all).run(
        ctx.ownerPool,
      );
      const movieCountries = await select(
        'movies_production_countries',
        all,
      ).run(ctx.ownerPool);
      const movieTags = await select('movies_tags', all).run(ctx.ownerPool);
      const movieTrailers = await select('movies_trailers', all).run(
        ctx.ownerPool,
      );
      const movieImages = await select('movies_images', all).run(ctx.ownerPool);

      expect(movies).toEqual<movies.JSONSelectable[]>([
        {
          title: 'Avatar',
          description: 'Avatar is a 2009 American epic science fiction film...',
          synopsis:
            "In 2154, humans have depleted Earth's natural resources...",
          external_id: 'avatar67A23',
          original_title: "James Cameron's Avatar",
          released: '2009-12-10',
          studio: '20th Century Fox',
          main_video_id: '0354c2ac-a6d2-45b4-94dc-000000000008',

          id: movies[0].id,
          created_date: movies[0].created_date,
          updated_date: movies[0].updated_date,
          created_user: DEFAULT_SYSTEM_USERNAME,
          updated_user: DEFAULT_SYSTEM_USERNAME,

          publish_status: 'NOT_PUBLISHED',
          published_date: null,
          published_user: null,
          ingest_correlation_id: null,
        },
      ]);

      expect(moviesCasts).toIncludeSameMembers([
        {
          movie_id: movies[0].id,
          name: 'Sam Worthington',
        },
        {
          movie_id: movies[0].id,
          name: 'Zoe Saldana',
        },
        {
          movie_id: movies[0].id,
          name: 'Sigourney Weaver',
        },
      ]);

      expect(moviesLicenses).toEqual<movies_licenses.JSONSelectable[]>([
        {
          id: moviesLicenses[0].id,
          license_start: '2020-08-01T00:00:00+00:00',
          license_end: '2020-08-30T23:59:59.999+00:00',
          movie_id: movies[0].id,
          updated_date: expect.any(String),
          created_date: expect.any(String),
        },
      ]);

      expect(moviesLicenseCountries).toIncludeSameMembers([
        {
          code: 'AW',
          movies_license_id: moviesLicenses[0].id,
        },
        {
          code: 'AT',
          movies_license_id: moviesLicenses[0].id,
        },
        {
          code: 'FI',
          movies_license_id: moviesLicenses[0].id,
        },
      ]);

      expect(movieGenreRelations).toIncludeSameMembers([
        {
          movie_genres_id: movieGenres[0].id,
          movie_id: movies[0].id,
        },
        {
          movie_genres_id: movieGenres[1].id,
          movie_id: movies[0].id,
        },
      ]);
      expect(movieCountries).toIncludeSameMembers([
        {
          movie_id: movies[0].id,
          name: 'Estonia',
        },
        {
          movie_id: movies[0].id,
          name: 'Germany',
        },
        {
          movie_id: movies[0].id,
          name: 'COL',
        },
        {
          movie_id: movies[0].id,
          name: 'United States of America',
        },
        {
          movie_id: movies[0].id,
          name: 'ESP',
        },
      ]);
      expect(movieTags).toIncludeSameMembers([
        {
          movie_id: movies[0].id,
          name: '3D',
        },
        {
          movie_id: movies[0].id,
          name: 'SciFi',
        },
        {
          movie_id: movies[0].id,
          name: 'Highlight',
        },
      ]);
      expect(movieTrailers).toIncludeSameMembers([
        {
          movie_id: movies[0].id,
          video_id: '0354c2ac-a6d2-45b4-94dc-000000000009',
        },
        {
          movie_id: movies[0].id,
          video_id: '0354c2ac-a6d2-45b4-94dc-000000000010',
        },
      ]);
      expect(movieImages).toIncludeSameMembers([
        {
          image_id: '11e1d903-49ed-4d70-8b24-000000000007',
          image_type: 'COVER',
          movie_id: movies[0].id,
        },
        {
          image_id: '11e1d903-49ed-4d70-8b24-000000000008',
          image_type: 'TEASER',
          movie_id: movies[0].id,
        },
      ]);

      //Tvshow
      const tvshows = await select('tvshows', all).run(ctx.ownerPool);
      const tvshowsCasts = await select('tvshows_casts', all).run(
        ctx.ownerPool,
      );
      const tvshowsLicenses = await select('tvshows_licenses', all).run(
        ctx.ownerPool,
      );
      const tvshowsLicenseCountries = await select(
        'tvshows_licenses_countries',
        {
          tvshows_license_id: c.isIn(tvshowsLicenses.map((x) => x.id)),
        },
      ).run(ctx.ownerPool);
      const tvshowGenreRelations = await select(
        'tvshows_tvshow_genres',
        all,
      ).run(ctx.ownerPool);
      const tvshowCountries = await select(
        'tvshows_production_countries',
        all,
      ).run(ctx.ownerPool);
      const tvshowTags = await select('tvshows_tags', all).run(ctx.ownerPool);
      const tvshowTrailers = await select('tvshows_trailers', all).run(
        ctx.ownerPool,
      );
      const tvshowImages = await select('tvshows_images', all).run(
        ctx.ownerPool,
      );

      expect(tvshows).toIncludeSameMembers([
        {
          created_date: tvshows[0].created_date,
          created_user: DEFAULT_SYSTEM_USERNAME,
          description:
            'After the stories of Jango and Boba Fett, another warrior emerges in the Star Wars universe...',
          external_id: 'mandalorian',
          id: tvshows[0].id,
          original_title: 'The Mandalorian',
          publish_status: 'NOT_PUBLISHED',
          published_date: null,
          published_user: null,
          released: '2019-11-12',
          studio: 'Lucasfilm',
          synopsis:
            'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.',
          title: 'Mandalorian',
          updated_date: tvshows[0].updated_date,
          updated_user: DEFAULT_SYSTEM_USERNAME,
          ingest_correlation_id: null,
        },
      ]);

      expect(tvshowsCasts).toIncludeSameMembers([
        {
          name: 'Pedro Pascal',
          tvshow_id: tvshows[0].id,
        },
        {
          name: 'Carl Weathers',
          tvshow_id: tvshows[0].id,
        },
        {
          name: 'Gina Carano',
          tvshow_id: tvshows[0].id,
        },
      ]);

      expect(tvshowsLicenses).toEqual<tvshows_licenses.JSONSelectable[]>([
        {
          id: tvshowsLicenses[0].id,
          license_end: '2020-08-30T23:59:59.999+00:00',
          license_start: '2020-08-01T00:00:00+00:00',
          tvshow_id: tvshows[0].id,
          updated_date: expect.any(String),
          created_date: expect.any(String),
        },
      ]);

      expect(tvshowsLicenseCountries).toIncludeSameMembers([
        {
          code: 'AW',
          tvshows_license_id: tvshowsLicenses[0].id,
        },
        {
          code: 'AT',
          tvshows_license_id: tvshowsLicenses[0].id,
        },
        {
          code: 'FI',
          tvshows_license_id: tvshowsLicenses[0].id,
        },
      ]);

      expect(tvshowGenreRelations).toIncludeSameMembers([
        {
          tvshow_genres_id: tvshowGenres[0].id,
          tvshow_id: tvshows[0].id,
        },
        {
          tvshow_genres_id: tvshowGenres[1].id,
          tvshow_id: tvshows[0].id,
        },
        {
          tvshow_genres_id: tvshowGenres[2].id,
          tvshow_id: tvshows[0].id,
        },
      ]);
      expect(tvshowCountries).toEqual<
        tvshows_production_countries.JSONSelectable[]
      >([
        {
          tvshow_id: tvshows[0].id,
          name: 'USA',
        },
      ]);
      expect(tvshowTags).toIncludeSameMembers([
        {
          tvshow_id: tvshows[0].id,
          name: 'star wars',
        },
        {
          tvshow_id: tvshows[0].id,
          name: 'mandalorian',
        },
        {
          tvshow_id: tvshows[0].id,
          name: 'bounty hunter',
        },
      ]);
      expect(tvshowTrailers).toIncludeSameMembers([
        {
          tvshow_id: tvshows[0].id,
          video_id: '0354c2ac-a6d2-45b4-94dc-000000000001',
        },
        {
          tvshow_id: tvshows[0].id,
          video_id: '0354c2ac-a6d2-45b4-94dc-000000000002',
        },
      ]);
      expect(tvshowImages).toIncludeSameMembers([
        {
          image_id: '11e1d903-49ed-4d70-8b24-000000000001',
          image_type: 'COVER',
          tvshow_id: tvshows[0].id,
        },
        {
          image_id: '11e1d903-49ed-4d70-8b24-000000000002',
          image_type: 'TEASER',
          tvshow_id: tvshows[0].id,
        },
      ]);

      //Season
      const seasons = await select('seasons', all).run(ctx.ownerPool);
      const seasonsCasts = await select('seasons_casts', all).run(
        ctx.ownerPool,
      );
      const seasonsLicenses = await select('seasons_licenses', all).run(
        ctx.ownerPool,
      );
      const seasonsLicenseCountries = await select(
        'seasons_licenses_countries',
        {
          seasons_license_id: c.isIn(seasonsLicenses.map((x) => x.id)),
        },
      ).run(ctx.ownerPool);
      const seasonGenreRelations = await select(
        'seasons_tvshow_genres',
        all,
      ).run(ctx.ownerPool);
      const seasonCountries = await select(
        'seasons_production_countries',
        all,
      ).run(ctx.ownerPool);
      const seasonTags = await select('seasons_tags', all).run(ctx.ownerPool);
      const seasonTrailers = await select('seasons_trailers', all).run(
        ctx.ownerPool,
      );
      const seasonImages = await select('seasons_images', all).run(
        ctx.ownerPool,
      );
      expect(seasons).toEqual<seasons.JSONSelectable[]>([
        {
          created_date: seasons[0].created_date,
          created_user: DEFAULT_SYSTEM_USERNAME,
          description:
            'After the stories of Jango and Boba Fett, another warrior emerges in the Star Wars universe...',
          external_id: 'mandalorian_s2',
          id: seasons[0].id,
          index: 2,
          publish_status: 'NOT_PUBLISHED',
          published_date: null,
          published_user: null,
          released: '2020-10-30',
          studio: 'Lucasfilm',
          synopsis:
            'A Mandalorian bounty hunter tracks a target for a well-paying, mysterious client.',
          tvshow_id: tvshows[0].id,
          updated_date: seasons[0].updated_date,
          updated_user: DEFAULT_SYSTEM_USERNAME,
          ingest_correlation_id: null,
        },
      ]);

      expect(seasonsCasts).toIncludeSameMembers([
        {
          name: 'Pedro Pascal',
          season_id: seasons[0].id,
        },
        {
          name: 'Carl Weathers',
          season_id: seasons[0].id,
        },
        {
          name: 'Gina Carano',
          season_id: seasons[0].id,
        },
      ]);

      expect(seasonsLicenses).toEqual<seasons_licenses.JSONSelectable[]>([
        {
          id: seasonsLicenses[0].id,
          license_start: '2020-08-01T00:00:00+00:00',
          license_end: '2020-08-30T23:59:59.999+00:00',
          season_id: seasons[0].id,
          updated_date: expect.any(String),
          created_date: expect.any(String),
        },
      ]);

      expect(seasonsLicenseCountries).toIncludeSameMembers([
        {
          code: 'AW',
          seasons_license_id: seasonsLicenses[0].id,
        },
        {
          code: 'AT',
          seasons_license_id: seasonsLicenses[0].id,
        },
        {
          code: 'FI',
          seasons_license_id: seasonsLicenses[0].id,
        },
      ]);

      expect(seasonGenreRelations).toIncludeSameMembers([
        {
          tvshow_genres_id: tvshowGenres[0].id,
          season_id: seasons[0].id,
        },
        {
          tvshow_genres_id: tvshowGenres[1].id,
          season_id: seasons[0].id,
        },
        {
          tvshow_genres_id: tvshowGenres[2].id,
          season_id: seasons[0].id,
        },
      ]);
      expect(seasonCountries).toEqual<
        seasons_production_countries.JSONSelectable[]
      >([
        {
          season_id: seasons[0].id,
          name: 'USA',
        },
      ]);
      expect(seasonTags).toIncludeSameMembers([
        {
          season_id: seasons[0].id,
          name: 'star wars',
        },
        {
          season_id: seasons[0].id,
          name: 'mandalorian',
        },
        {
          season_id: seasons[0].id,
          name: 'bounty hunter',
        },
      ]);
      expect(seasonTrailers).toIncludeSameMembers([
        {
          season_id: seasons[0].id,
          video_id: '0354c2ac-a6d2-45b4-94dc-000000000003',
        },
        {
          season_id: seasons[0].id,
          video_id: '0354c2ac-a6d2-45b4-94dc-000000000004',
        },
      ]);
      expect(seasonImages).toIncludeSameMembers([
        {
          image_id: '11e1d903-49ed-4d70-8b24-000000000003',
          image_type: 'COVER',
          season_id: seasons[0].id,
        },
        {
          image_id: '11e1d903-49ed-4d70-8b24-000000000004',
          image_type: 'TEASER',
          season_id: seasons[0].id,
        },
      ]);

      //Episode
      const episodes = await select('episodes', all).run(ctx.ownerPool);
      const episodesCasts = await select('episodes_casts', all).run(
        ctx.ownerPool,
      );
      const episodesLicenses = await select('episodes_licenses', all).run(
        ctx.ownerPool,
      );
      const episodesLicenseCountries = await select(
        'episodes_licenses_countries',
        {
          episodes_license_id: c.isIn(episodesLicenses.map((x) => x.id)),
        },
      ).run(ctx.ownerPool);
      const episodeGenreRelations = await select(
        'episodes_tvshow_genres',
        all,
      ).run(ctx.ownerPool);
      const episodeCountries = await select(
        'episodes_production_countries',
        all,
      ).run(ctx.ownerPool);
      const episodeTags = await select('episodes_tags', all).run(ctx.ownerPool);
      const episodeTrailers = await select('episodes_trailers', all).run(
        ctx.ownerPool,
      );
      const episodeImages = await select('episodes_images', all).run(
        ctx.ownerPool,
      );

      expect(episodes).toEqual<episodes.JSONSelectable[]>([
        {
          created_date: episodes[0].created_date,
          created_user: DEFAULT_SYSTEM_USERNAME,
          description:
            'After the stories of Jango and Boba Fett, another warrior emerges in the Star Wars universe...',
          external_id: 'mandalorian_s2_e1',
          id: episodes[0].id,
          index: 1,
          main_video_id: '0354c2ac-a6d2-45b4-94dc-000000000005',
          original_title: 'Chapter 9: The Marshal',
          publish_status: 'NOT_PUBLISHED',
          published_date: null,
          published_user: null,
          released: '2020-10-30',
          season_id: seasons[0].id,
          studio: 'Lucasfilm',
          synopsis:
            'The Mandalorian is drawn to the Outer Rim in search of others of his kind.',
          title: 'The Marshal',
          updated_date: episodes[0].updated_date,
          updated_user: DEFAULT_SYSTEM_USERNAME,
          ingest_correlation_id: null,
        },
      ]);

      expect(episodesCasts).toIncludeSameMembers([
        {
          name: 'Pedro Pascal',
          episode_id: episodes[0].id,
        },
        {
          name: 'Carl Weathers',
          episode_id: episodes[0].id,
        },
        {
          name: 'Gina Carano',
          episode_id: episodes[0].id,
        },
      ]);

      expect(episodesLicenses).toEqual<episodes_licenses.JSONSelectable[]>([
        {
          id: episodesLicenses[0].id,
          license_start: '2020-08-01T00:00:00+00:00',
          license_end: '2020-08-30T23:59:59.999+00:00',
          episode_id: episodes[0].id,
          updated_date: expect.any(String),
          created_date: expect.any(String),
        },
      ]);

      expect(episodesLicenseCountries).toIncludeSameMembers([
        {
          code: 'AW',
          episodes_license_id: episodesLicenses[0].id,
        },
        {
          code: 'AT',
          episodes_license_id: episodesLicenses[0].id,
        },
        {
          code: 'FI',
          episodes_license_id: episodesLicenses[0].id,
        },
      ]);

      expect(episodeGenreRelations).toIncludeSameMembers([
        {
          tvshow_genres_id: tvshowGenres[0].id,
          episode_id: episodes[0].id,
        },
        {
          tvshow_genres_id: tvshowGenres[1].id,
          episode_id: episodes[0].id,
        },
        {
          tvshow_genres_id: tvshowGenres[2].id,
          episode_id: episodes[0].id,
        },
      ]);
      expect(episodeCountries).toIncludeSameMembers([
        {
          episode_id: episodes[0].id,
          name: 'USA',
        },
      ]);
      expect(episodeTags).toIncludeSameMembers([
        {
          episode_id: episodes[0].id,
          name: 'star wars',
        },
        {
          episode_id: episodes[0].id,
          name: 'mandalorian',
        },
        {
          episode_id: episodes[0].id,
          name: 'bounty hunter',
        },
      ]);
      expect(episodeTrailers).toIncludeSameMembers([
        {
          episode_id: episodes[0].id,
          video_id: '0354c2ac-a6d2-45b4-94dc-000000000006',
        },
        {
          episode_id: episodes[0].id,
          video_id: '0354c2ac-a6d2-45b4-94dc-000000000007',
        },
      ]);
      expect(episodeImages).toIncludeSameMembers([
        {
          episode_id: episodes[0].id,
          image_id: '11e1d903-49ed-4d70-8b24-000000000005',
          image_type: 'COVER',
        },
        {
          episode_id: episodes[0].id,
          image_id: '11e1d903-49ed-4d70-8b24-000000000006',
          image_type: 'TEASER',
        },
      ]);

      //Ingest
      const docs = await select('ingest_documents', all).run(ctx.ownerPool);
      const items = await select('ingest_items', all, {
        order: [{ by: 'id', direction: 'ASC' }],
      }).run(ctx.ownerPool);
      const steps = await select('ingest_item_steps', all, {
        order: [{ by: 'ingest_item_id', direction: 'ASC' }],
        columns: [
          'status',
          'sub_type',
          'type',
          'ingest_item_id',
          'response_message',
        ],
      }).run(ctx.ownerPool);

      const fileJson = JSON.parse(readFileSync(filePath, 'utf8'));

      expect(docs).toEqual<ingest_documents.JSONSelectable[]>([
        {
          name: 'Test Ingest',
          title: 'Test Ingest',
          status: 'SUCCESS',
          started_count: 4,
          items_count: 4,
          success_count: 4,
          in_progress_count: 0,
          error_count: 0,
          document_created: null,
          errors: [],

          id: docs[0].id,
          document: fileJson,
          created_date: docs[0].created_date,
          updated_date: docs[0].updated_date,
          created_user: DEFAULT_SYSTEM_USERNAME,
          updated_user: DEFAULT_SYSTEM_USERNAME,
        },
      ]);

      expect(items).toIncludeSameMembers([
        {
          status: 'SUCCESS',
          exists_status: 'CREATED',
          errors: [],
          processed_trailer_ids: [
            '0354c2ac-a6d2-45b4-94dc-000000000001',
            '0354c2ac-a6d2-45b4-94dc-000000000002',
          ],
          external_id: 'mandalorian',
          type: 'TVSHOW',

          entity_id: tvshows[0].id,
          display_title: tvshows[0].title,
          ingest_document_id: docs[0].id,

          id: items[0].id,
          item: fileJson.items[3],
          created_date: items[0].created_date,
          updated_date: items[0].updated_date,
          created_user: DEFAULT_SYSTEM_USERNAME,
          updated_user: DEFAULT_SYSTEM_USERNAME,
        },
        {
          status: 'SUCCESS',
          exists_status: 'CREATED',
          errors: [],
          processed_trailer_ids: [
            '0354c2ac-a6d2-45b4-94dc-000000000003',
            '0354c2ac-a6d2-45b4-94dc-000000000004',
          ],
          external_id: 'mandalorian_s2',
          type: 'SEASON',

          entity_id: seasons[0].id,
          display_title: `Season ${seasons[0].index} (${tvshows[0].title})`,
          ingest_document_id: docs[0].id,

          id: items[1].id,
          item: fileJson.items[2],
          created_date: items[1].created_date,
          updated_date: items[1].updated_date,
          created_user: DEFAULT_SYSTEM_USERNAME,
          updated_user: DEFAULT_SYSTEM_USERNAME,
        },
        {
          status: 'SUCCESS',
          exists_status: 'CREATED',
          errors: [],
          processed_trailer_ids: [
            '0354c2ac-a6d2-45b4-94dc-000000000006',
            '0354c2ac-a6d2-45b4-94dc-000000000007',
          ],
          external_id: 'mandalorian_s2_e1',
          type: 'EPISODE',

          entity_id: episodes[0].id,
          display_title: `Episode ${episodes[0].index}: ${episodes[0].title} (Season ${seasons[0].index}, ${tvshows[0].title})`,
          ingest_document_id: docs[0].id,

          id: items[2].id,
          item: fileJson.items[1],
          created_date: items[2].created_date,
          updated_date: items[2].updated_date,
          created_user: DEFAULT_SYSTEM_USERNAME,
          updated_user: DEFAULT_SYSTEM_USERNAME,
        },
        {
          status: 'SUCCESS',
          exists_status: 'CREATED',
          errors: [],
          processed_trailer_ids: [
            '0354c2ac-a6d2-45b4-94dc-000000000009',
            '0354c2ac-a6d2-45b4-94dc-000000000010',
          ],
          external_id: 'avatar67A23',
          type: 'MOVIE',

          entity_id: movies[0].id,
          ingest_document_id: docs[0].id,
          display_title: movies[0].title,

          id: items[3].id,
          item: fileJson.items[0],
          created_date: items[3].created_date,
          updated_date: items[3].updated_date,
          created_user: DEFAULT_SYSTEM_USERNAME,
          updated_user: DEFAULT_SYSTEM_USERNAME,
        },
      ]);

      expect(steps).toIncludeSameMembers([
        {
          ingest_item_id: items[0].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'METADATA',
          type: 'ENTITY',
        },
        {
          ingest_item_id: items[0].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'TRAILER',
          type: 'VIDEO',
        },
        {
          ingest_item_id: items[0].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'TRAILER',
          type: 'VIDEO',
        },
        {
          ingest_item_id: items[0].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'COVER',
          type: 'IMAGE',
        },
        {
          ingest_item_id: items[0].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'TEASER',
          type: 'IMAGE',
        },
        {
          ingest_item_id: items[1].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'METADATA',
          type: 'ENTITY',
        },
        {
          ingest_item_id: items[1].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'TRAILER',
          type: 'VIDEO',
        },
        {
          ingest_item_id: items[1].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'TRAILER',
          type: 'VIDEO',
        },
        {
          ingest_item_id: items[1].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'COVER',
          type: 'IMAGE',
        },
        {
          ingest_item_id: items[1].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'TEASER',
          type: 'IMAGE',
        },
        {
          ingest_item_id: items[2].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'METADATA',
          type: 'ENTITY',
        },
        {
          ingest_item_id: items[2].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'MAIN',
          type: 'VIDEO',
        },
        {
          ingest_item_id: items[2].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'TRAILER',
          type: 'VIDEO',
        },
        {
          ingest_item_id: items[2].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'TRAILER',
          type: 'VIDEO',
        },
        {
          ingest_item_id: items[2].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'COVER',
          type: 'IMAGE',
        },
        {
          ingest_item_id: items[2].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'TEASER',
          type: 'IMAGE',
        },
        {
          ingest_item_id: items[3].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'METADATA',
          type: 'ENTITY',
        },
        {
          ingest_item_id: items[3].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'MAIN',
          type: 'VIDEO',
        },
        {
          ingest_item_id: items[3].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'TRAILER',
          type: 'VIDEO',
        },
        {
          ingest_item_id: items[3].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'TRAILER',
          type: 'VIDEO',
        },
        {
          ingest_item_id: items[3].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'COVER',
          type: 'IMAGE',
        },
        {
          ingest_item_id: items[3].id,
          response_message: null,
          status: 'SUCCESS',
          sub_type: 'TEASER',
          type: 'IMAGE',
        },
      ]);
    });
  });
});
