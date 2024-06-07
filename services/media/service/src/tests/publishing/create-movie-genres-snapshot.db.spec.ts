import { toBeUuid } from '@axinom/mosaic-service-common';
import { StoreInboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import 'jest-extended';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
} from 'media-messages';
import { all, insert, select } from 'zapatos/db';
import * as tokenHelpers from '../../common/utils/token-utils';
import * as snapshotHelpers from '../../publishing/utils/snapshot-utils';
import {
  createTestContext,
  createTestRequestContext,
  ITestContext,
  TestRequestContext,
} from '../test-utils';
import { CREATE_MOVIE_GENRES_SNAPSHOT } from './gql-constants';

describe('Create Movie Genres snapshot endpoint', () => {
  let ctx: ITestContext;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    payload: PublishEntityCommand;
  }[] = [];

  beforeAll(async () => {
    const storeInboxMessage: StoreInboxMessage = jest.fn(
      async (_aggregateId, { messageType }, payload) => {
        messages.push({
          payload: payload as PublishEntityCommand,
          messageType,
        });
      },
    );
    ctx = await createTestContext({}, undefined, storeInboxMessage);
    defaultRequestContext = createTestRequestContext(ctx.config.serviceId);
  });

  beforeEach(async () => {
    await insert('movie_genres', {
      title: 'Valid Genre',
      sort_order: 1,
    }).run(ctx.ownerPool);
    jest
      .spyOn(tokenHelpers, 'getLongLivedToken')
      .mockImplementation(async () => 'test-long-lived-token');
  });

  afterEach(async () => {
    await ctx.truncate('movie_genres');
    await ctx.truncate('snapshots');
    messages = [];
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('createMovieGenresSnapshot', () => {
    it('create snapshot while movie genre exists -> correct response received, message sent and snapshot created', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        CREATE_MOVIE_GENRES_SNAPSHOT,
        {},
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();
      const snapshot = resp.data?.createMovieGenresSnapshot;

      expect(snapshot).toMatchObject({
        createdUser: 'System',
        updatedUser: 'System',
        entityId: 1,
        entityTitle: 'Movie Genres',
        entityType: 'MOVIE_GENRE',
        publishId: `movie_genre-1`,
        publishedDate: null,
        scheduledDate: null,
        snapshotJson: null,
        snapshotNo: 1,
        snapshotState: 'INITIALIZATION',
        unpublishedDate: null,
        validationStatus: null,
      });
      toBeUuid(snapshot.jobId);
      expect(snapshot.id).toBeGreaterThan(0);

      expect(messages).toEqual([
        {
          payload: {
            entity_id: snapshot.id,
            table_name: 'snapshots',
            publish_options: {
              action: 'NO_PUBLISH',
            },
          },
          messageType: MediaServiceMessagingSettings.PublishEntity.messageType,
        },
      ]);

      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      expect(snapshots).toEqual([
        {
          created_date: snapshot.createdDate,
          created_user: snapshot.createdUser,
          entity_id: snapshot.entityId,
          entity_title: snapshot.entityTitle,
          entity_type: snapshot.entityType,
          id: snapshot.id,
          job_id: snapshot.jobId,
          publish_id: snapshot.publishId,
          published_date: snapshot.publishedDate,
          scheduled_date: snapshot.scheduledDate,
          snapshot_json: snapshot.snapshotJson,
          snapshot_no: snapshot.snapshotNo,
          snapshot_state: snapshot.snapshotState,
          unpublished_date: snapshot.unpublishedDate,
          updated_date: snapshot.updatedDate,
          updated_user: snapshot.updatedUser,
          validation_status: snapshot.validationStatus,
          is_list_snapshot: snapshot.isListSnapshot,
        },
      ]);
    });

    it('create snapshot while no genres exist -> correct response received, message sent and snapshot created', async () => {
      // Arrange
      await ctx.truncate('movie_genres');

      // Act
      const resp = await ctx.runGqlQuery(
        CREATE_MOVIE_GENRES_SNAPSHOT,
        {},
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();
      const snapshot = resp.data?.createMovieGenresSnapshot;

      expect(snapshot).toMatchObject({
        createdUser: 'System',
        updatedUser: 'System',
        entityId: 1,
        entityTitle: 'Movie Genres',
        entityType: 'MOVIE_GENRE',
        publishId: `movie_genre-1`,
        publishedDate: null,
        scheduledDate: null,
        snapshotJson: null,
        snapshotNo: 1,
        snapshotState: 'INITIALIZATION',
        unpublishedDate: null,
        validationStatus: null,
      });
      toBeUuid(snapshot.jobId);
      expect(snapshot.id).toBeGreaterThan(0);

      expect(messages).toEqual([
        {
          payload: {
            entity_id: snapshot.id,
            table_name: 'snapshots',
            publish_options: {
              action: 'NO_PUBLISH',
            },
          },
          messageType: MediaServiceMessagingSettings.PublishEntity.messageType,
        },
      ]);

      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      expect(snapshots).toEqual([
        {
          created_date: snapshot.createdDate,
          created_user: snapshot.createdUser,
          entity_id: snapshot.entityId,
          entity_title: snapshot.entityTitle,
          entity_type: snapshot.entityType,
          id: snapshot.id,
          job_id: snapshot.jobId,
          publish_id: snapshot.publishId,
          published_date: snapshot.publishedDate,
          scheduled_date: snapshot.scheduledDate,
          snapshot_json: snapshot.snapshotJson,
          snapshot_no: snapshot.snapshotNo,
          snapshot_state: snapshot.snapshotState,
          unpublished_date: snapshot.unpublishedDate,
          updated_date: snapshot.updatedDate,
          updated_user: snapshot.updatedUser,
          validation_status: snapshot.validationStatus,
          is_list_snapshot: snapshot.isListSnapshot,
        },
      ]);
    });

    it('error thrown -> error received, message not sent and snapshot not created', async () => {
      // Arrange
      jest
        .spyOn(snapshotHelpers, 'createListSnapshot')
        .mockImplementation(async () => {
          throw new Error('Unexpected Error happened!');
        });

      // Act
      const resp = await ctx.runGqlQuery(
        CREATE_MOVIE_GENRES_SNAPSHOT,
        {},
        defaultRequestContext,
      );

      // Assert
      expect(resp.data?.createMovieSnapshot).toBeFalsy();
      expect(resp.errors).toHaveLength(1);
      expect(resp.errors?.[0]).toMatchObject({
        code: 'CREATE_SNAPSHOT_ERROR',
        details: undefined,
        message: `Attempt to create a snapshot for Movie genres list has failed.`,
        path: ['createMovieGenresSnapshot'],
      });

      expect(messages).toEqual([]);

      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      expect(snapshots).toEqual([]);
    });
  });
});
