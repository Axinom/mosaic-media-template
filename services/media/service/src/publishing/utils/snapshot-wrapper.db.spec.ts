import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import {
  createOffsetDate,
  dateToBeInRange,
  rejectionOf,
} from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { PublishServiceMessagingSettings } from 'media-messages';
import { SnapshotStateEnum } from 'zapatos/custom';
import { insert, select, selectExactlyOne, update } from 'zapatos/db';
import { movies, snapshots } from 'zapatos/schema';
import { testAllowAllSchema } from '../../tests/ingest/mock-publish-processor';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { EntityPublishingProcessor, SnapshotValidationResult } from '../models';
import {
  createSnapshotWithRelation,
  PUBLISHABLE_SNAPSHOT_STATES,
  UNPUBLISHABLE_SNAPSHOT_STATES,
} from '../utils';
import { SnapshotWrapper } from './snapshot-wrapper';

describe('SnapshotWrapper', () => {
  let ctx: ITestContext;
  let movie1: movies.JSONSelectable;
  let snapshot1: snapshots.JSONSelectable;
  let wrapper: SnapshotWrapper;
  let storeOutboxMessage: StoreOutboxMessage;
  let user: AuthenticatedManagementSubject;
  const authToken = 'does-not-matter-as-request-is-mocked';
  const messageType = 'test:queue';
  const mockMessagingSettings = stub<PublishServiceMessagingSettings>({
    messageType,
  });
  const messages: unknown[] = [];
  let timestampBeforeTest: Date;
  const getAggregator = (result = {}) => {
    return async () => ({
      result,
      validation: [],
    });
  };

  beforeAll(async () => {
    ctx = await createTestContext();
    user = createTestUser(ctx.config.serviceId);
    storeOutboxMessage = jest.fn(
      async (_aggregateId, { messageType }, payload, _client, optionalData) => {
        const { envelopeOverrides, options } = optionalData || {};
        messages.push({
          payload,
          messageType,
          envelopeOverrides,
          options,
        });
      },
    );
  });

  beforeEach(async () => {
    timestampBeforeTest = createOffsetDate(-20);
    movie1 = await insert('movies', {
      title: 'Entity1',
      external_id: 'existing1',
    }).run(ctx.ownerPool);
    snapshot1 = await createSnapshotWithRelation(
      'MOVIE',
      movie1.id,
      '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
      ctx.ownerPool,
    );
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    await ctx.truncate('snapshots');
    jest.restoreAllMocks();
    messages.length = 0;
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('prepareAndValidate', () => {
    it('no metadata -> valid result', async () => {
      // Arrange
      const processor = stub<EntityPublishingProcessor>({
        type: 'movies',
        aggregator: getAggregator(),
        validationSchema: testAllowAllSchema,
        validator: async () => [],
      });

      // Act
      await ctx.executeGqlSql(user, async (ct) => {
        wrapper = new SnapshotWrapper(
          snapshot1.id,
          ct,
          storeOutboxMessage,
          ctx.config,
        );
        await wrapper.prepareAndValidate(processor, ctx.config, authToken);
      });

      // Assert
      const validationResults = await select('snapshot_validation_results', {
        snapshot_id: snapshot1.id,
      }).run(ctx.ownerPool);
      const updatedSnapshot = await selectExactlyOne('snapshots', {
        id: snapshot1.id,
      }).run(ctx.ownerPool);

      expect(validationResults).toEqual([]);
      expect(updatedSnapshot).toMatchObject({
        // Auto-generated
        // created_date: '2021-05-26T10:34:53.133+00:00',
        // updated_date: '2021-05-26T10:34:53.133+00:00',
        validation_status: 'OK',
        snapshot_state: 'READY',
        entity_title: snapshot1.entity_title,
        snapshot_json: {},
        entity_type: 'MOVIE',
        job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
        publish_id: `movie-${movie1.id}`,
        published_date: null,
        scheduled_date: null,
        snapshot_no: 1,
        unpublished_date: null,
        created_user: 'Unknown',
        updated_user: 'System',
        entity_id: movie1.id,
        id: snapshot1.id,
      });
    });

    it('full metadata -> valid result', async () => {
      // Arrange
      const json = {
        cast: ['Actress 1', 'Actor 2'],
        tags: ['Tag 1', 'Tag 3'],
        content_id: `movie-${movie1.id}`,
        description: 'desc',
        genre_ids: [`movie_genre-1`, `movie_genre-2`],
        images: [
          {
            width: 111,
            height: 222,
            image_type: 'COVER',
            path: 'test/path.png',
          },
        ],
        licenses: [
          {
            countries: ['KW'],
            end_time: '2021-09-01T15:05:25+00:00',
            start_time: '2021-02-01T15:05:25+00:00',
          },
          {
            countries: ['BY', 'DE'],
          },
        ],
        original_title: 'test original_title',
        production_countries: ['Imaginary Country A', 'Imaginary Country B'],
        released: 'test released',
        studio: 'test studio',
        synopsis: 'test synopsis',
        title: 'Entity1',
        videos: [
          {
            type: 'MAIN',
            title: 'test video',
            is_protected: true,
            output_format: 'CMAF',
          },
        ],
      };
      const processor = stub<EntityPublishingProcessor>({
        type: 'movies',
        aggregator: getAggregator(json),
        validationSchema: testAllowAllSchema,
        validator: async () => [],
      });

      // Act
      await ctx.executeGqlSql(user, async (ct) => {
        wrapper = new SnapshotWrapper(
          snapshot1.id,
          ct,
          storeOutboxMessage,
          ctx.config,
        );
        await wrapper.prepareAndValidate(processor, ctx.config, authToken);
      });

      // Assert
      const validationResults = await select('snapshot_validation_results', {
        snapshot_id: snapshot1.id,
      }).run(ctx.ownerPool);
      const updatedSnapshot = await selectExactlyOne('snapshots', {
        id: snapshot1.id,
      }).run(ctx.ownerPool);

      expect(validationResults).toEqual([]);
      expect(updatedSnapshot).toMatchObject({
        // Auto-generated
        // created_date: '2021-05-26T10:34:53.133+00:00',
        // updated_date: '2021-05-26T10:34:53.133+00:00',
        validation_status: 'OK',
        snapshot_state: 'READY',
        entity_title: json.title,
        snapshot_json: json,
        entity_type: 'MOVIE',
        job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
        publish_id: `movie-${movie1.id}`,
        published_date: null,
        scheduled_date: null,
        snapshot_no: 1,
        unpublished_date: null,
        created_user: 'Unknown',
        updated_user: 'System',
        entity_id: movie1.id,
        id: snapshot1.id,
      });
    });

    it('minimal metadata with warning -> valid result', async () => {
      // Arrange
      const json = { title: 'Some title' };
      const warn: SnapshotValidationResult = {
        context: 'VIDEO',
        message: `test stream warning`,
        severity: 'WARNING',
      };
      const processor = stub<EntityPublishingProcessor>({
        type: 'movies',
        aggregator: getAggregator(json),
        validationSchema: testAllowAllSchema,
        validator: async () => [warn],
      });

      // Act
      await ctx.executeGqlSql(user, async (ct) => {
        wrapper = new SnapshotWrapper(
          snapshot1.id,
          ct,
          storeOutboxMessage,
          ctx.config,
        );
        await wrapper.prepareAndValidate(processor, ctx.config, authToken);
      });

      // Assert
      const validationResults = await select('snapshot_validation_results', {
        snapshot_id: snapshot1.id,
      }).run(ctx.ownerPool);
      const updatedSnapshot = await selectExactlyOne('snapshots', {
        id: snapshot1.id,
      }).run(ctx.ownerPool);

      expect(validationResults).toMatchObject([
        {
          ...warn,
          entity_type: snapshot1.entity_type,
          snapshot_id: snapshot1.id,
        },
      ]);
      expect(updatedSnapshot).toMatchObject({
        // Auto-generated
        // created_date: '2021-05-26T10:34:53.133+00:00',
        // updated_date: '2021-05-26T10:34:53.133+00:00',
        validation_status: 'WARNINGS',
        snapshot_state: 'READY',
        entity_title: snapshot1.entity_title,
        snapshot_json: json,
        entity_type: 'MOVIE',
        job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
        publish_id: `movie-${movie1.id}`,
        published_date: null,
        scheduled_date: null,
        snapshot_no: 1,
        unpublished_date: null,
        created_user: 'Unknown',
        updated_user: 'System',
        entity_id: movie1.id,
        id: snapshot1.id,
      });
    });

    it('minimal metadata with error -> valid result', async () => {
      // Arrange
      const json = { title: 'Some title' };
      const err: SnapshotValidationResult = {
        context: 'VIDEO',
        message: `test stream warning`,
        severity: 'ERROR',
      };
      const processor = stub<EntityPublishingProcessor>({
        type: 'movies',
        aggregator: getAggregator(json),
        validationSchema: testAllowAllSchema,
        validator: async () => [err],
      });

      // Act
      await ctx.executeGqlSql(user, async (ct) => {
        wrapper = new SnapshotWrapper(
          snapshot1.id,
          ct,
          storeOutboxMessage,
          ctx.config,
        );
        await wrapper.prepareAndValidate(processor, ctx.config, authToken);
      });

      // Assert
      const validationResults = await select('snapshot_validation_results', {
        snapshot_id: snapshot1.id,
      }).run(ctx.ownerPool);
      const updatedSnapshot = await selectExactlyOne('snapshots', {
        id: snapshot1.id,
      }).run(ctx.ownerPool);

      expect(validationResults).toMatchObject([
        {
          ...err,
          entity_type: snapshot1.entity_type,
          snapshot_id: snapshot1.id,
        },
      ]);
      expect(updatedSnapshot).toMatchObject({
        // Auto-generated
        // created_date: '2021-05-26T10:34:53.133+00:00',
        // updated_date: '2021-05-26T10:34:53.133+00:00',
        validation_status: 'ERRORS',
        snapshot_state: 'INVALID',
        entity_title: snapshot1.entity_title,
        snapshot_json: json,
        entity_type: 'MOVIE',
        job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
        publish_id: `movie-${movie1.id}`,
        published_date: null,
        scheduled_date: null,
        snapshot_no: 1,
        unpublished_date: null,
        created_user: 'Unknown',
        updated_user: 'System',
        entity_id: movie1.id,
        id: snapshot1.id,
      });
    });

    it.each([
      'INVALID',
      'PUBLISHED',
      'READY',
      'SCHEDULED',
      'UNPUBLISHED',
      'VALIDATION',
      'VERSION_MISMATCH',
    ])('snapshot state is %p -> update skipped', async (state) => {
      // Arrange
      const json = { title: 'Some title' };
      const snapshot = await update(
        'snapshots',
        { snapshot_state: state as SnapshotStateEnum },
        { id: snapshot1.id },
      ).run(ctx.ownerPool);
      const processor = stub<EntityPublishingProcessor>({
        type: 'movies',
        aggregator: getAggregator(json),
        validationSchema: testAllowAllSchema,
        validator: async () => [],
      });

      // Act
      await ctx.executeGqlSql(user, async (ct) => {
        wrapper = new SnapshotWrapper(
          snapshot1.id,
          ct,
          storeOutboxMessage,
          ctx.config,
        );
        await wrapper.prepareAndValidate(processor, ctx.config, authToken);
      });

      // Assert
      const updatedSnapshot = await selectExactlyOne('snapshots', {
        id: snapshot1.id,
      }).run(ctx.ownerPool);

      expect(updatedSnapshot).toEqual(snapshot[0]);
    });

    it('snapshot that does not exist -> error thrown', async () => {
      // Arrange
      const invalidId = snapshot1.id + 10;
      const processor = stub<EntityPublishingProcessor>({
        type: 'movies',
        aggregator: getAggregator(),
        validationSchema: testAllowAllSchema,
        validator: async () => [],
      });

      // Act
      const error = await ctx.executeGqlSql(user, async (ct) => {
        wrapper = new SnapshotWrapper(
          invalidId,
          ct,
          storeOutboxMessage,
          ctx.config,
        );
        return rejectionOf(
          wrapper.prepareAndValidate(processor, ctx.config, authToken),
        );
      });

      // Assert
      expect(error.message).toBe(
        `The snapshot with ID '${invalidId}' was not found.`,
      );
    });
  });

  describe('publish', () => {
    it.each([...PUBLISHABLE_SNAPSHOT_STATES])(
      'snapshot in publishable state %p -> message sent and snapshot updated',
      async (state) => {
        // Arrange
        const payload = { title: 'Some title' };
        const snapshot = await update(
          'snapshots',
          { snapshot_state: state, snapshot_json: payload },
          { id: snapshot1.id },
        ).run(ctx.ownerPool);

        // Act
        await ctx.executeGqlSql(user, async (ct) => {
          wrapper = new SnapshotWrapper(
            snapshot1.id,
            ct,
            storeOutboxMessage,
            ctx.config,
          );
          await wrapper.publish(mockMessagingSettings, authToken);
        });

        // Assert
        const { published_date, snapshot_state, ...unchanged } =
          await selectExactlyOne('snapshots', {
            id: snapshot1.id,
          }).run(ctx.ownerPool);
        const {
          updated_date,
          updated_user,
          published_date: originalDate,
          snapshot_state: originalState,
          ...original
        } = snapshot[0];

        expect(published_date).not.toEqual(originalDate);
        dateToBeInRange(published_date as string, timestampBeforeTest);
        expect(snapshot_state).not.toEqual(originalState);
        expect(snapshot_state).toEqual('PUBLISHED');
        expect(unchanged).toMatchObject(original);

        expect(messages).toEqual([
          {
            payload,
            messageType,
            envelopeOverrides: { auth_token: authToken },
            options: undefined,
          },
        ]);
      },
    );

    it.each([
      'INITIALIZATION',
      'INVALID',
      'PUBLISHED',
      'VALIDATION',
      'VERSION_MISMATCH',
    ])(
      'snapshot not in publishable state %p -> message not sent and snapshot not updated',
      async (state) => {
        // Arrange
        const json = { title: 'Some title' };
        const snapshot = await update(
          'snapshots',
          { snapshot_state: state as SnapshotStateEnum, snapshot_json: json },
          { id: snapshot1.id },
        ).run(ctx.ownerPool);

        // Act
        await ctx.executeGqlSql(user, async (ct) => {
          wrapper = new SnapshotWrapper(
            snapshot1.id,
            ct,
            storeOutboxMessage,
            ctx.config,
          );
          await wrapper.publish(mockMessagingSettings, authToken);
        });

        // Assert
        const notUpdatedSnapshot = await selectExactlyOne('snapshots', {
          id: snapshot1.id,
        }).run(ctx.ownerPool);

        expect(notUpdatedSnapshot).toEqual(snapshot[0]);
        expect(messages).toEqual([]);
      },
    );

    it('snapshot in publishable state, but no json stored -> message not sent and snapshot state changed to ERROR', async () => {
      // Arrange
      const snapshot = await update(
        'snapshots',
        { snapshot_state: 'READY' },
        { id: snapshot1.id },
      ).run(ctx.ownerPool);

      // Act
      await ctx.executeGqlSql(user, async (ct) => {
        wrapper = new SnapshotWrapper(
          snapshot1.id,
          ct,
          storeOutboxMessage,
          ctx.config,
        );
        await wrapper.publish(mockMessagingSettings, authToken);
      });

      // Assert
      const errorSnapshot = await selectExactlyOne('snapshots', {
        id: snapshot1.id,
      }).run(ctx.ownerPool);

      expect(errorSnapshot.snapshot_state).toEqual('ERROR');
      expect(errorSnapshot.snapshot_state).not.toEqual(
        snapshot[0].snapshot_state,
      );
      expect(errorSnapshot.updated_date).not.toEqual(snapshot[0].updated_date);
      expect(errorSnapshot.updated_user).not.toEqual(snapshot[0].updated_user);
      expect(messages).toEqual([]);
    });

    it('snapshot is published while another published snapshot exists -> message sent and snapshot updated, other snapshot unpublished', async () => {
      // Arrange
      const payload = { title: 'Some title' };
      const snapshot = await createSnapshotWithRelation(
        'MOVIE',
        movie1.id,
        '25b9d0f1-08db-43a8-87f3-7c771dc98a0e',
        ctx.ownerPool,
      );
      const publishedSnapshot = await update(
        'snapshots',
        { snapshot_state: 'PUBLISHED' },
        { id: snapshot.id },
      ).run(ctx.ownerPool);

      const snapshotToPublish = await update(
        'snapshots',
        { snapshot_state: 'READY', snapshot_json: payload },
        { id: snapshot1.id },
      ).run(ctx.ownerPool);

      // Act
      await ctx.executeGqlSql(user, async (ct) => {
        wrapper = new SnapshotWrapper(
          snapshot1.id,
          ct,
          storeOutboxMessage,
          ctx.config,
        );
        await wrapper.publish(mockMessagingSettings, authToken);
      });

      // Assert
      const { published_date, snapshot_state, ...unchanged } =
        await selectExactlyOne('snapshots', {
          id: snapshot1.id,
        }).run(ctx.ownerPool);
      const {
        updated_date,
        updated_user,
        published_date: originalDate,
        snapshot_state: originalState,
        ...original
      } = snapshotToPublish[0];

      expect(published_date).not.toEqual(originalDate);
      dateToBeInRange(published_date as string, timestampBeforeTest);
      expect(snapshot_state).not.toEqual(originalState);
      expect(snapshot_state).toEqual('PUBLISHED');
      expect(unchanged).toMatchObject(original);

      expect(messages).toEqual([
        {
          payload,
          messageType,
          envelopeOverrides: { auth_token: authToken },
          options: undefined,
        },
      ]);

      const {
        unpublished_date,
        snapshot_state: unpublishedState,
        ...unchangedPublished
      } = await selectExactlyOne('snapshots', {
        id: publishedSnapshot[0].id,
      }).run(ctx.ownerPool);
      const {
        updated_user: originalUpdatedUser,
        updated_date: originalUpdatedDate,
        unpublished_date: originalUnpublishedDate,
        snapshot_state: originalPublishState,
        ...originalPublishedSnapshot
      } = publishedSnapshot[0];

      expect(unpublished_date).not.toEqual(originalUnpublishedDate);
      dateToBeInRange(unpublished_date as string, timestampBeforeTest);
      expect(unpublishedState).not.toEqual(originalPublishState);
      expect(unpublishedState).toEqual('UNPUBLISHED');
      expect(unchangedPublished).toMatchObject(originalPublishedSnapshot);
    });

    it('snapshot that does not exist -> error thrown', async () => {
      // Arrange
      const invalidId = snapshot1.id + 10;

      // Act
      const error = await ctx.executeGqlSql(user, async (ct) => {
        wrapper = new SnapshotWrapper(
          invalidId,
          ct,
          storeOutboxMessage,
          ctx.config,
        );
        return rejectionOf(wrapper.publish(mockMessagingSettings, authToken));
      });

      // Assert
      expect(error.message).toBe(
        `The snapshot with ID '${invalidId}' was not found.`,
      );
    });
  });

  describe('unpublish', () => {
    it.each([...UNPUBLISHABLE_SNAPSHOT_STATES])(
      'snapshot in publishable state %p -> message sent and snapshot updated',
      async (state) => {
        // Arrange
        const snapshot = await update(
          'snapshots',
          { snapshot_state: state },
          { id: snapshot1.id },
        ).run(ctx.ownerPool);

        const payload = {
          content_id: snapshot[0].publish_id,
        };

        // Act
        await ctx.executeGqlSql(user, async (ct) => {
          wrapper = new SnapshotWrapper(
            snapshot1.id,
            ct,
            storeOutboxMessage,
            ctx.config,
          );
          await wrapper.unpublish(mockMessagingSettings, authToken);
        });

        // Assert
        const { unpublished_date, snapshot_state, ...unchanged } =
          await selectExactlyOne('snapshots', {
            id: snapshot1.id,
          }).run(ctx.ownerPool);
        const {
          updated_date,
          updated_user,
          unpublished_date: originalDate,
          snapshot_state: originalState,
          ...original
        } = snapshot[0];

        expect(unpublished_date).not.toEqual(originalDate);
        dateToBeInRange(unpublished_date as string, timestampBeforeTest);
        expect(snapshot_state).toEqual('UNPUBLISHED');
        expect(unchanged).toMatchObject(original);

        expect(messages).toEqual([
          {
            payload,
            messageType,
            envelopeOverrides: { auth_token: authToken },
            options: undefined,
          },
        ]);
      },
    );

    it.each([
      'INITIALIZATION',
      'INVALID',
      'READY',
      'SCHEDULED',
      'VALIDATION',
      'VERSION_MISMATCH',
    ])(
      'snapshot not in unpublishable state %p -> message not sent and snapshot not updated',
      async (state) => {
        // Arrange
        const snapshot = await update(
          'snapshots',
          { snapshot_state: state as SnapshotStateEnum },
          { id: snapshot1.id },
        ).run(ctx.ownerPool);

        // Act
        await ctx.executeGqlSql(user, async (ct) => {
          wrapper = new SnapshotWrapper(
            snapshot1.id,
            ct,
            storeOutboxMessage,
            ctx.config,
          );
          await wrapper.unpublish(mockMessagingSettings, authToken);
        });

        // Assert
        const notUpdatedSnapshot = await selectExactlyOne('snapshots', {
          id: snapshot1.id,
        }).run(ctx.ownerPool);

        expect(notUpdatedSnapshot).toEqual(snapshot[0]);
        expect(messages).toEqual([]);
      },
    );
  });

  it('snapshot that does not exist -> error thrown', async () => {
    // Arrange
    const invalidId = snapshot1.id + 10;

    // Act
    const error = await ctx.executeGqlSql(user, async (ct) => {
      wrapper = new SnapshotWrapper(
        invalidId,
        ct,
        storeOutboxMessage,
        ctx.config,
      );
      return rejectionOf(wrapper.unpublish(mockMessagingSettings, authToken));
    });

    // Assert
    expect(error.message).toBe(
      `The snapshot with ID '${invalidId}' was not found.`,
    );
  });
});
