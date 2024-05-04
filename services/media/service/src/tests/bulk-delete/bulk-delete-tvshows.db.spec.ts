import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
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
import { DELETE_TVSHOWS } from './gql-constants';

describe('Tvshows Bulk Delete endpoint', () => {
  let ctx: ITestContext;
  let tvshowId1: number;
  let tvshowId2: number;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    payload: DeleteEntityCommand;
  }[] = [];

  const createTvshow = async (
    title: string,
    studio: string,
  ): Promise<number> => {
    const { id } = await insert('tvshows', {
      title,
      studio,
      publish_status: 'NOT_PUBLISHED',
    }).run(ctx.ownerPool);
    return id;
  };

  beforeAll(async () => {
    const storeOutboxMessage: StoreOutboxMessage = jest.fn(
      async (_aggregateId, { messageType }, payload) => {
        messages.push({ payload: payload as DeleteEntityCommand, messageType });
      },
    );
    ctx = await createTestContext({}, storeOutboxMessage);
    defaultRequestContext = createTestRequestContext(ctx.config.serviceId);
    jest
      .spyOn(tokenHelpers, 'getLongLivedToken')
      .mockImplementation(async () => 'test-long-lived-token');
  });

  beforeEach(async () => {
    tvshowId1 = await createTvshow('Valid Tvshow1', 'Universal');
    tvshowId2 = await createTvshow('Second Tvshow2', 'Warner Br.');
  });

  afterEach(async () => {
    await ctx.truncate('tvshows');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('deleteTvshows', () => {
    it.each([
      (id: number) => ({
        id: { in: [id + 10, id + 11, id] },
      }),
      () => ({ title: { likeInsensitive: '%valid%' } }),
      () => ({ studio: { equalTo: 'Universal' } }),
    ])(
      'delete one tvshow -> correct response received and message sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_TVSHOWS,
          { filter: getFilter(tvshowId1) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteTvshows.affectedIds).toIncludeSameMembers([
          tvshowId1,
        ]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            payload: {
              entity_id: tvshowId1,
              entity_type: 'Tvshow',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'tvshows',
            },
          },
        ]);
      },
    );

    it.each([
      (id1: number, id2: number) => ({
        id: { in: [id1, id2, id2 + 10] },
      }),
      () => ({ title: { likeInsensitive: '%show%' } }),
      () => ({ studio: { likeInsensitive: '%er%' } }),
    ])(
      'delete two tvshows -> correct response received and messages sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_TVSHOWS,
          { filter: getFilter(tvshowId1, tvshowId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteTvshows.affectedIds).toIncludeSameMembers([
          tvshowId1,
          tvshowId2,
        ]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            payload: {
              entity_id: tvshowId1,
              entity_type: 'Tvshow',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'tvshows',
            },
          },
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            payload: {
              entity_id: tvshowId2,
              entity_type: 'Tvshow',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'tvshows',
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
      'delete using filters that find no tvshows -> message is not sent and response is empty',
      async (getFilter) => {
        // Act
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_TVSHOWS,
          { filter: getFilter(tvshowId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteTvshows.affectedIds).toEqual([]);
        expect(messages).toEqual([]);
      },
    );
  });
});
