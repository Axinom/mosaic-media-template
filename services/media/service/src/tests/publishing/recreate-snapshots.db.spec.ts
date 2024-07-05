import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import 'jest-extended';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
} from 'media-messages';
import { EntityTypeEnum } from 'zapatos/custom';
import { all, insert, select } from 'zapatos/db';
import { snapshots } from 'zapatos/schema';
import * as tokenHelpers from '../../common/utils/token-utils';
import { createListSnapshot, generateSnapshotJobId } from '../../publishing';
import {
  createTestContext,
  createTestRequestContext,
  ITestContext,
  TestRequestContext,
} from '../test-utils';
import { RECREATE_SNAPSHOTS } from './gql-constants';

describe('Recreate snapshots endpoint', () => {
  let ctx: ITestContext;
  let defaultRequestContext: TestRequestContext;
  let snapshot1: snapshots.JSONSelectable;
  let messages: {
    messageType: string;
    payload: PublishEntityCommand;
  }[] = [];
  beforeAll(async () => {
    const storeOutboxMessage: StoreOutboxMessage = jest.fn(
      async (_aggregateId, { messageType }, payload) => {
        messages.push({
          payload: payload as PublishEntityCommand,
          messageType,
        });
      },
    );
    ctx = await createTestContext({}, storeOutboxMessage);
    defaultRequestContext = createTestRequestContext(ctx.config.serviceId);
    jest
      .spyOn(tokenHelpers, 'getLongLivedToken')
      .mockImplementation(async () => 'test-long-lived-token');
  });

  const createSnapshot = async (entityId: number, type: EntityTypeEnum) => {
    return insert('snapshots', {
      entity_id: entityId,
      publish_id: `movie-${entityId}`,
      job_id: '4f936eab-ed44-455d-ab22-fea3f50195ed',
      snapshot_no: entityId,
      entity_type: type,
    }).run(ctx.ownerPool);
  };

  beforeEach(async () => {
    snapshot1 = await createSnapshot(1, 'MOVIE');
  });

  afterEach(async () => {
    await ctx.truncate('snapshots');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('recreateSnapshots', () => {
    it('filter which finds no snapshots -> message is not sent', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        RECREATE_SNAPSHOTS,
        { filter: { id: { notEqualTo: snapshot1.id } } },
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.recreateSnapshots.affectedIds).toEqual([]);
      expect(messages).toEqual([]);

      const snapshots = await select('snapshots', { id: snapshot1.id }).run(
        ctx.ownerPool,
      );
      expect(snapshots).toEqual([snapshot1]);
    });

    it('filter which finds one snapshot -> one message is sent', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        RECREATE_SNAPSHOTS,
        { filter: { id: { equalTo: snapshot1.id } } },
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.recreateSnapshots.affectedIds).toEqual([snapshot1.id]);
      expect(messages).toMatchObject([
        {
          payload: {
            entity_id: 1,
            publish_options: {
              action: 'NO_PUBLISH',
            },
            table_name: 'movies',
          },
          messageType: MediaServiceMessagingSettings.PublishEntity.messageType,
        },
      ]);

      const snapshots = await select('snapshots', { id: snapshot1.id }).run(
        ctx.ownerPool,
      );
      expect(snapshots).toEqual([snapshot1]);
    });

    it.each([
      ['MOVIE', 'movies'],
      ['EPISODE', 'episodes'],
      ['TVSHOW', 'tvshows'],
      ['SEASON', 'seasons'],
      ['COLLECTION', 'collections'],
      ['TVSHOW_GENRE', 'tvshow_genres'],
      ['MOVIE_GENRE', 'movie_genres'],
    ])(
      'filter which finds two snapshot for different entities, second type is %p -> two messages are sent, second table is %p',
      async (entityType, expectedTableName) => {
        // Arrange
        const snapshot2 = await createSnapshot(2, entityType as EntityTypeEnum);

        // Act
        const resp = await ctx.runGqlQuery(
          RECREATE_SNAPSHOTS,
          { filter: { id: { isNull: false } } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.recreateSnapshots.affectedIds).toEqual([
          snapshot1.id,
          snapshot2.id,
        ]);
        expect(messages).toMatchObject([
          {
            payload: {
              entity_id: 1,
              publish_options: {
                action: 'NO_PUBLISH',
              },
              table_name: 'movies',
            },
            messageType:
              MediaServiceMessagingSettings.PublishEntity.messageType,
          },
          {
            payload: {
              entity_id: 2,
              publish_options: {
                action: 'NO_PUBLISH',
              },
              table_name: expectedTableName,
            },
            messageType:
              MediaServiceMessagingSettings.PublishEntity.messageType,
          },
        ]);

        const snapshots = await select('snapshots', all).run(ctx.ownerPool);
        expect(snapshots).toEqual([snapshot1, snapshot2]);
      },
    );

    it('filter which finds two snapshot for same entity -> one message is sent', async () => {
      // Arrange
      const snapshot2 = await createSnapshot(1, 'MOVIE');

      // Act
      const resp = await ctx.runGqlQuery(
        RECREATE_SNAPSHOTS,
        { filter: { id: { isNull: false } } },
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.recreateSnapshots.affectedIds).toEqual([
        snapshot1.id,
        snapshot2.id,
      ]);
      expect(messages).toMatchObject([
        {
          payload: {
            entity_id: 1,
            publish_options: {
              action: 'NO_PUBLISH',
            },
            table_name: 'movies',
          },
          messageType: MediaServiceMessagingSettings.PublishEntity.messageType,
        },
      ]);

      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      expect(snapshots).toEqual([snapshot1, snapshot2]);
    });

    it('filter which find list and non-list snapshots -> two messages are sent and initial list snapshot created', async () => {
      // Arrange
      const snapshot2 = await createListSnapshot(
        {
          id: 2,
          table: 'movie_genres',
          title: 'Genres',
          type: 'MOVIE_GENRE',
        },
        generateSnapshotJobId(),
        ctx.ownerPool,
      );

      // Act
      const resp = await ctx.runGqlQuery(
        RECREATE_SNAPSHOTS,
        { filter: { id: { isNull: false } } },
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.recreateSnapshots.affectedIds).toEqual([
        snapshot1.id,
        snapshot2.id,
      ]);
      expect(messages).toMatchObject([
        {
          payload: {
            entity_id: 1,
            table_name: 'movies',
            publish_options: {
              action: 'NO_PUBLISH',
            },
          },
          messageType: MediaServiceMessagingSettings.PublishEntity.messageType,
        },
        {
          payload: {
            entity_id: snapshot2.id + 1,
            table_name: 'snapshots',
            publish_options: {
              action: 'NO_PUBLISH',
            },
          },
          messageType: MediaServiceMessagingSettings.PublishEntity.messageType,
        },
      ]);

      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      expect(snapshots).toMatchObject([
        snapshot1,
        snapshot2,
        {
          entity_id: 2,
          entity_title: 'Genres',
          entity_type: 'MOVIE_GENRE',
          id: snapshot2.id + 1,
          is_list_snapshot: true,
          publish_id: 'movie_genre-2',
          published_date: null,
          scheduled_date: null,
          snapshot_json: null,
          snapshot_no: 2,
          snapshot_state: 'INITIALIZATION',
          unpublished_date: null,
          validation_status: null,
        },
      ]);
    });
  });
});
