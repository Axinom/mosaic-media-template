import { Broker } from '@axinom/mosaic-message-bus';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import {
  MediaServiceMessagingSettings,
  UnpublishEntityCommand,
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
import { UNPUBLISH_SNAPSHOTS } from './gql-constants';

describe('Snapshots Bulk Unpublish endpoint', () => {
  let ctx: ITestContext;
  let snapshotId1: number;
  let snapshotId2: number;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    message: UnpublishEntityCommand;
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
    const broker = stub<Broker>({
      publish: (messageType: string, message: UnpublishEntityCommand) => {
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

  describe('unpublishSnapshots', () => {
    it.each([
      (id: number) => ({
        id: { in: [id + 10, id + 11, id] },
      }),
      () => ({ snapshotState: { equalTo: 'PUBLISHED' } }),
    ])(
      'unpublish one snapshot -> correct response received and message sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          UNPUBLISH_SNAPSHOTS,
          { filter: getFilter(snapshotId1) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.unpublishSnapshots.affectedIds).toIncludeSameMembers(
          [snapshotId1],
        );
        expect(messages).toEqual([
          {
            message: {
              entity_id: snapshotId1,
              entity_type: 'Snapshot',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'snapshots',
            },
            messageType:
              MediaServiceMessagingSettings.UnpublishEntity.messageType,
          },
        ]);
      },
    );

    it.each([
      (id1: number, id2: number) => ({
        id: { in: [id1, id2, id2 + 10] },
      }),
      () => ({ publishId: { likeInsensitive: 'movie-%' } }),
    ])(
      'unpublish two snapshots -> correct response received and messages sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          UNPUBLISH_SNAPSHOTS,
          { filter: getFilter(snapshotId1, snapshotId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.unpublishSnapshots.affectedIds).toIncludeSameMembers(
          [snapshotId1, snapshotId2],
        );

        expect(messages).toEqual([
          {
            message: {
              entity_id: snapshotId1,
              entity_type: 'Snapshot',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'snapshots',
            },
            messageType:
              MediaServiceMessagingSettings.UnpublishEntity.messageType,
          },
          {
            message: {
              entity_id: snapshotId2,
              entity_type: 'Snapshot',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'snapshots',
            },
            messageType:
              MediaServiceMessagingSettings.UnpublishEntity.messageType,
          },
        ]);
      },
    );

    it.each([
      (id2: number) => ({
        id: { in: [id2 + 10, id2 + 11, id2 + 12] },
      }),
      () => ({ snapshotNo: { greaterThan: 2 } }),
      () => ({ entityType: { equalTo: 'EPISODE' } }),
    ])(
      'unpublish using filters that find no snapshots -> message is not sent and response is empty',
      async (getFilter) => {
        // Act
        // Act
        const resp = await ctx.runGqlQuery(
          UNPUBLISH_SNAPSHOTS,
          { filter: getFilter(snapshotId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.unpublishSnapshots.affectedIds).toEqual([]);
        expect(messages).toEqual([]);
      },
    );
  });
});
