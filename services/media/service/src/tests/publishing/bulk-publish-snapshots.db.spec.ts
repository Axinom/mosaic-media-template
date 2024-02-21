import { toBeUuid } from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import 'jest-extended';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
} from 'media-messages';
import { SnapshotStateEnum } from 'zapatos/custom';
import { insert } from 'zapatos/db';
import * as tokenHelpers from '../../common/utils/token-utils';
import {
  createTestContext,
  createTestRequestContext,
  ITestContext,
  TestRequestContext,
} from '../test-utils';
import { PUBLISH_SNAPSHOTS } from './gql-constants';

describe('Snapshots Bulk Publish endpoint', () => {
  let ctx: ITestContext;
  let snapshotId1: number;
  let snapshotId2: number;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    payload: PublishEntityCommand;
  }[] = [];

  const createSnapshot = async (
    entityId: number,
    state: SnapshotStateEnum = 'PUBLISHED',
  ): Promise<number> => {
    const { id } = await insert('snapshots', {
      entity_id: entityId,
      publish_id: `movie-${entityId}`,
      job_id: '4f936eab-ed44-455d-ab22-fea3f50195ed',
      snapshot_no: 1,
      entity_type: 'MOVIE',
      snapshot_state: state,
    }).run(ctx.ownerPool);
    return id;
  };

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

  beforeEach(async () => {
    snapshotId1 = await createSnapshot(1);
    snapshotId2 = await createSnapshot(2, 'INITIALIZATION');
  });

  afterEach(async () => {
    await ctx.truncate('snapshots');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('publishSnapshots', () => {
    it.each([
      (id: number) => ({
        id: { in: [id + 10, id + 11, id] },
      }),
      () => ({ snapshotState: { equalTo: 'PUBLISHED' } }),
    ])(
      'publish one snapshot -> correct response received and message sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          PUBLISH_SNAPSHOTS,
          { filter: getFilter(snapshotId1) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.publishSnapshots.affectedIds).toIncludeSameMembers([
          snapshotId1,
        ]);
        expect(messages).toHaveLength(1);
        expect(messages[0]).toMatchObject({
          payload: {
            entity_id: snapshotId1,
            table_name: 'snapshots',
            publish_options: { action: 'PUBLISH_NOW' },
          },
          messageType: MediaServiceMessagingSettings.PublishEntity.messageType,
        });
        toBeUuid(messages[0].payload.job_id as string);
      },
    );

    it.each([
      (id1: number, id2: number) => ({
        id: { in: [id1, id2, id2 + 10] },
      }),
      () => ({ publishId: { likeInsensitive: 'movie-%' } }),
    ])(
      'publish two snapshots -> correct response received and messages sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          PUBLISH_SNAPSHOTS,
          { filter: getFilter(snapshotId1, snapshotId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.publishSnapshots.affectedIds).toIncludeSameMembers([
          snapshotId1,
          snapshotId2,
        ]);

        expect(messages).toHaveLength(2);
        expect(messages[0]).toMatchObject({
          payload: {
            entity_id: snapshotId1,
            table_name: 'snapshots',
            publish_options: { action: 'PUBLISH_NOW' },
          },
          messageType: MediaServiceMessagingSettings.PublishEntity.messageType,
        });
        expect(messages[1]).toMatchObject({
          payload: {
            entity_id: snapshotId2,
            table_name: 'snapshots',
            publish_options: { action: 'PUBLISH_NOW' },
          },
          messageType: MediaServiceMessagingSettings.PublishEntity.messageType,
        });
        toBeUuid(messages[0].payload.job_id as string);
        toBeUuid(messages[1].payload.job_id as string);
      },
    );

    it.each([
      (id2: number) => ({
        id: { in: [id2 + 10, id2 + 11, id2 + 12] },
      }),
      () => ({ snapshotNo: { greaterThan: 2 } }),
      () => ({ entityType: { equalTo: 'EPISODE' } }),
    ])(
      'publish using filters that find no snapshots -> message is not sent and response is empty',
      async (getFilter) => {
        // Act
        // Act
        const resp = await ctx.runGqlQuery(
          PUBLISH_SNAPSHOTS,
          { filter: getFilter(snapshotId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.publishSnapshots.affectedIds).toEqual([]);
        expect(messages).toEqual([]);
      },
    );
  });
});
