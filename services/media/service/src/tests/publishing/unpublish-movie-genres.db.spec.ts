import { toBeUuid } from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import {
  MediaServiceMessagingSettings,
  UnpublishEntityCommand,
} from 'media-messages';
import { OutboxMessage } from 'pg-transactional-outbox';
import { all, select, update } from 'zapatos/db';
import { snapshots } from 'zapatos/schema';
import * as tokenHelpers from '../../common/utils/token-utils';
import { createListSnapshot, generateSnapshotJobId } from '../../publishing';
import {
  createTestContext,
  createTestRequestContext,
  ITestContext,
  TestRequestContext,
} from '../test-utils';
import { UNPUBLISH_MOVIE_GENRES } from './gql-constants';

describe('Movie Unpublish endpoint', () => {
  let ctx: ITestContext;
  let snapshot1: snapshots.JSONSelectable;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    payload: UnpublishEntityCommand;
  }[] = [];

  beforeAll(async () => {
    const storeOutboxMessage: StoreOutboxMessage = jest.fn(
      async (_aggregateId, { messageType }, payload) => {
        messages.push({
          payload: payload as UnpublishEntityCommand,
          messageType,
        });
        return Promise.resolve(stub<OutboxMessage>());
      },
    );
    ctx = await createTestContext({}, storeOutboxMessage);
    defaultRequestContext = createTestRequestContext(ctx.config.serviceId);
    jest
      .spyOn(tokenHelpers, 'getLongLivedToken')
      .mockImplementation(async () => 'test-long-lived-token');
  });

  beforeEach(async () => {
    snapshot1 = await createListSnapshot(
      {
        id: 1,
        title: 'Movie Genres',
        type: 'MOVIE_GENRE',
        table: 'movie_genres',
      },
      generateSnapshotJobId(),
      ctx.ownerPool,
    );
  });

  afterEach(async () => {
    await ctx.truncate('snapshots');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('unpublishMovieGenres', () => {
    it('unpublish existing published snapshot -> correct response received and message sent', async () => {
      // Arrange
      await update(
        'snapshots',
        { snapshot_state: 'PUBLISHED' },
        { id: snapshot1.id },
      ).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(
        UNPUBLISH_MOVIE_GENRES,
        {},
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();
      const snapshot = resp.data?.unpublishMovieGenres;

      expect(snapshot).toMatchObject({
        createdUser: 'Unknown',
        updatedUser: 'Unknown',
        entityId: snapshot1.entity_id,
        entityTitle: snapshot1.entity_title,
        entityType: snapshot1.entity_type,
        publishId: snapshot1.publish_id,
        unpublishedDate: null,
        scheduledDate: null,
        snapshotJson: null,
        snapshotNo: 1,
        snapshotState: 'PUBLISHED',
        publishedDate: null,
        validationStatus: null,
      });
      toBeUuid(snapshot.jobId);
      expect(snapshot.id).toBeGreaterThan(0);

      expect(messages).toEqual([
        {
          payload: {
            entity_id: snapshot1.id,
            table_name: 'snapshots',
          },
          messageType:
            MediaServiceMessagingSettings.UnpublishEntity.messageType,
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

    it('unpublish snapshot while no published snapshots exist -> error is thrown', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        UNPUBLISH_MOVIE_GENRES,
        {},
        defaultRequestContext,
      );

      // Assert
      expect(resp.data?.unpublishMovieGenres).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: 'UNPUBLISH_ERROR',
          details: undefined,
          message: 'Movie genres list does not have a published snapshot.',
          path: ['unpublishMovieGenres'],
        },
      ]);

      expect(messages).toEqual([]);

      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      expect(snapshots).toEqual([snapshot1]);
    });
  });
});
