import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import {
  DeleteEntityCommand,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { OutboxMessage } from 'pg-transactional-outbox';
import { insert } from 'zapatos/db';
import * as tokenHelpers from '../../common/utils/token-utils';
import {
  createTestContext,
  createTestRequestContext,
  ITestContext,
  TestRequestContext,
} from '../test-utils';
import { DELETE_COLLECTIONS } from './gql-constants';

describe('Collections Bulk Delete endpoint', () => {
  let ctx: ITestContext;
  let collectionId1: number;
  let collectionId2: number;
  let defaultRequestContext: TestRequestContext;
  const messages: {
    messageType: string;
    payload: DeleteEntityCommand;
  }[] = [];

  const createCollection = async (
    title: string,
    externalId: string,
  ): Promise<number> => {
    const { id } = await insert('collections', {
      title,
      publish_status: 'NOT_PUBLISHED',
      external_id: externalId,
    }).run(ctx.ownerPool);
    return id;
  };

  beforeAll(async () => {
    const storeOutboxMessage: StoreOutboxMessage = jest.fn(
      async (_aggregateId, { messageType }, payload) => {
        messages.push({ payload: payload as DeleteEntityCommand, messageType });
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
    collectionId1 = await createCollection('Valid Collection1', 'asd-ac-c1');
    collectionId2 = await createCollection('Second Collection2', 'asd-mc-c1');
  });

  afterEach(async () => {
    await ctx.truncate('collections');
    messages.length = 0;
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('deleteCollections', () => {
    it.each([
      (id: number) => ({
        id: { in: [id + 10, id + 11, id] },
      }),
      () => ({ title: { likeInsensitive: '%valid%' } }),
      () => ({ externalId: { startsWith: 'asd-ac-' } }),
    ])(
      'delete one collection -> correct response received and message sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_COLLECTIONS,
          { filter: getFilter(collectionId1) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteCollections.affectedIds).toIncludeSameMembers([
          collectionId1,
        ]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            payload: {
              entity_id: collectionId1,
              entity_type: 'Collection',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'collections',
            },
          },
        ]);
      },
    );

    it.each([
      (id1: number, id2: number) => ({
        id: { in: [id1, id2, id2 + 10] },
      }),
      () => ({ title: { likeInsensitive: '%col%' } }),
      () => ({ externalId: { startsWith: 'asd-' } }),
    ])(
      'delete two collections -> correct response received and messages sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_COLLECTIONS,
          { filter: getFilter(collectionId1, collectionId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteCollections.affectedIds).toIncludeSameMembers([
          collectionId1,
          collectionId2,
        ]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            payload: {
              entity_id: collectionId1,
              entity_type: 'Collection',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'collections',
            },
          },
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            payload: {
              entity_id: collectionId2,
              entity_type: 'Collection',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'collections',
            },
          },
        ]);
      },
    );

    it.each([
      (id2: number) => ({
        id: { in: [id2 + 10, id2 + 11, id2 + 12] },
      }),
      () => ({ title: { likeInsensitive: '%non existing%' } }),
      () => ({ publishStatus: { equalTo: 'PUBLISHED' } }),
    ])(
      'delete using filters that find no collections -> message is not sent and response is empty',
      async (getFilter) => {
        // Act
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_COLLECTIONS,
          { filter: getFilter(collectionId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteCollections.affectedIds).toEqual([]);
        expect(messages).toEqual([]);
      },
    );
  });
});
