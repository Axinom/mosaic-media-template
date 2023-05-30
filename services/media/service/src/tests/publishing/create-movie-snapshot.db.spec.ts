import { Broker } from '@axinom/mosaic-message-bus';
import { toBeUuid } from '@axinom/mosaic-service-common';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
} from 'media-messages';
import { insert, select } from 'zapatos/db';
import * as tokenHelpers from '../../common/utils/token-utils';
import {
  createTestContext,
  createTestRequestContext,
  ITestContext,
  TestRequestContext,
} from '../test-utils';
import { CREATE_MOVIE_SNAPSHOT } from './gql-constants';

describe('Create Movie snapshot endpoint', () => {
  let ctx: ITestContext;
  let movieId1: number;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    message: PublishEntityCommand;
  }[] = [];

  beforeAll(async () => {
    const broker = stub<Broker>({
      publish: (messageType: string, message: PublishEntityCommand) => {
        messages.push({ messageType, message });
      },
    });
    ctx = await createTestContext({}, broker);
    defaultRequestContext = createTestRequestContext(ctx.config.serviceId);
    jest
      .spyOn(tokenHelpers, 'getLongLivedToken')
      .mockImplementation(async () => 'test-long-lived-token');
  });

  beforeEach(async () => {
    movieId1 = (
      await insert('movies', { title: 'Valid Movie1' }).run(ctx.ownerPool)
    ).id;
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    await ctx.truncate('snapshots');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('createMovieSnapshot', () => {
    it('create snapshot for existing movie -> correct response received, message sent and snapshot created with relation', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        CREATE_MOVIE_SNAPSHOT,
        { movieId: movieId1 },
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();
      const snapshot = resp.data?.createMovieSnapshot;

      expect(snapshot).toMatchObject({
        createdUser: 'System',
        updatedUser: 'System',
        entityId: movieId1,
        entityTitle: 'Valid Movie1',
        entityType: 'MOVIE',
        publishId: `movie-${movieId1}`,
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
          message: {
            entity_id: snapshot.id,
            table_name: 'snapshots',
            publish_options: {
              action: 'NO_PUBLISH',
            },
          },
          messageType: MediaServiceMessagingSettings.PublishEntity.messageType,
        },
      ]);

      const snapshots = await select('snapshots', { entity_id: movieId1 }).run(
        ctx.ownerPool,
      );
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

      const relations = await select('movies_snapshots', {
        movie_id: movieId1,
      }).run(ctx.ownerPool);
      expect(relations).toEqual([
        { movie_id: movieId1, snapshot_id: snapshot.id },
      ]);
    });

    it('create snapshot for non-existing movie -> error returned, message not sent, snapshot not created', async () => {
      // Arrange
      const invalidId = movieId1 + 10;

      // Act
      const resp = await ctx.runGqlQuery(
        CREATE_MOVIE_SNAPSHOT,
        { movieId: invalidId },
        defaultRequestContext,
      );

      // Assert
      expect(resp.data?.createMovieSnapshot).toBeFalsy();
      expect(resp.errors).toHaveLength(1);
      expect(resp.errors?.[0]).toMatchObject({
        code: 'MEDIA_NOT_FOUND',
        details: undefined,
        message: `MOVIE with ID '${invalidId}' was not found.`,
        path: ['createMovieSnapshot'],
      });

      expect(messages).toEqual([]);

      const snapshots = await select('snapshots', { entity_id: movieId1 }).run(
        ctx.ownerPool,
      );
      expect(snapshots).toEqual([]);

      const relations = await select('movies_snapshots', {
        movie_id: movieId1,
      }).run(ctx.ownerPool);
      expect(relations).toEqual([]);
    });
  });
});
