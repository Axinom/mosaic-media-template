import { Broker } from '@axinom/mosaic-message-bus';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import {
  DeleteEntityCommand,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { insert } from 'zapatos/db';
import * as tokenHelpers from '../../common/utils/token-utils';
import {
  createTestContext,
  createTestRequestContext,
  ITestContext,
  TestRequestContext,
} from '../test-utils';
import { DELETE_SNAPSHOTS } from './gql-constants';

describe('Snapshots Bulk Delete endpoint', () => {
  let ctx: ITestContext;
  let snapshotId1: number;
  let snapshotId2: number;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    message: DeleteEntityCommand;
  }[] = [];

  const createSnapshot = async (
    entityType: 'MOVIE' | 'EPISODE',
    snapshotNo: number,
  ): Promise<number> => {
    const { id } = await insert('snapshots', {
      entity_id: 1,
      publish_id: '2',
      job_id: '3',
      snapshot_no: snapshotNo,
      entity_type: entityType,
    }).run(ctx.ownerPool);
    return id;
  };

  beforeAll(async () => {
    const broker = stub<Broker>({
      publish: (
        _id: string,
        settings: MessagingSettings,
        message: DeleteEntityCommand,
      ) => {
        messages.push({ messageType: settings.messageType, message });
      },
    });
    ctx = await createTestContext({}, broker);
    defaultRequestContext = createTestRequestContext(ctx.config.serviceId);
    jest
      .spyOn(tokenHelpers, 'getLongLivedToken')
      .mockImplementation(async () => 'test-long-lived-token');
  });

  beforeEach(async () => {
    snapshotId1 = await createSnapshot('MOVIE', 1);
    snapshotId2 = await createSnapshot('EPISODE', 2);
  });

  afterEach(async () => {
    await ctx.truncate('snapshots');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('deleteSnapshots', () => {
    it.each([
      (id: number) => ({
        id: { in: [id + 10, id + 11, id] },
      }),
      () => ({ entityType: { equalTo: 'MOVIE' } }),
      () => ({ snapshotNo: { equalTo: 1 } }),
    ])(
      'delete one snapshot -> correct response received and message sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_SNAPSHOTS,
          { filter: getFilter(snapshotId1) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteSnapshots.affectedIds).toIncludeSameMembers([
          snapshotId1,
        ]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            message: {
              entity_id: snapshotId1,
              entity_type: 'Snapshot',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'snapshots',
            },
          },
        ]);
      },
    );

    it.each([
      (id1: number, id2: number) => ({
        id: { in: [id1, id2, id2 + 10] },
      }),
      () => ({
        or: [
          { entityType: { equalTo: 'MOVIE' } },
          { entityType: { equalTo: 'EPISODE' } },
        ],
      }),
      () => ({ not: { snapshotNo: { equalTo: 3 } } }),
    ])(
      'delete two snapshots -> correct response received and messages sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_SNAPSHOTS,
          { filter: getFilter(snapshotId1, snapshotId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteSnapshots.affectedIds).toIncludeSameMembers([
          snapshotId1,
          snapshotId2,
        ]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            message: {
              entity_id: snapshotId1,
              entity_type: 'Snapshot',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'snapshots',
            },
          },
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            message: {
              entity_id: snapshotId2,
              entity_type: 'Snapshot',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'snapshots',
            },
          },
        ]);
      },
    );

    it.each([
      (id2: number) => ({
        id: { in: [id2 + 10, id2 + 11, id2 + 12] },
      }),
      () => ({
        and: [
          { entityType: { equalTo: 'MOVIE' } },
          { snapshotNo: { equalTo: 2 } },
        ],
      }),
      () => ({
        and: [
          { not: { snapshotNo: { equalTo: 1 } } },
          { not: { snapshotNo: { equalTo: 2 } } },
        ],
      }),
    ])(
      'delete using filters that find no snapshots -> message is not sent and response is empty',
      async (getFilter) => {
        // Act
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_SNAPSHOTS,
          { filter: getFilter(snapshotId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteSnapshots.affectedIds).toEqual([]);
        expect(messages).toEqual([]);
      },
    );
  });
});
