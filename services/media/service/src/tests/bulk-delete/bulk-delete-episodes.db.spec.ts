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
import { DELETE_EPISODES } from './gql-constants';

describe('Episodes Bulk Delete endpoint', () => {
  let ctx: ITestContext;
  let episodeId1: number;
  let episodeId2: number;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    payload: DeleteEntityCommand;
  }[] = [];

  const createEpisode = async (
    title: string,
    studio: string,
  ): Promise<number> => {
    const { id } = await insert('episodes', {
      title,
      studio,
      publish_status: 'NOT_PUBLISHED',
      index: 1,
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
    episodeId1 = await createEpisode('Valid Episode1', 'Universal');
    episodeId2 = await createEpisode('Second Episode2', 'Warner Br.');
  });

  afterEach(async () => {
    await ctx.truncate('episodes');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('deleteEpisodes', () => {
    it.each([
      (id: number) => ({
        id: { in: [id + 10, id + 11, id] },
      }),
      () => ({ title: { likeInsensitive: '%valid%' } }),
      () => ({ studio: { equalTo: 'Universal' } }),
    ])(
      'delete one episode -> correct response received and message sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_EPISODES,
          { filter: getFilter(episodeId1) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteEpisodes.affectedIds).toIncludeSameMembers([
          episodeId1,
        ]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            payload: {
              entity_id: episodeId1,
              entity_type: 'Episode',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'episodes',
            },
          },
        ]);
      },
    );

    it.each([
      (id1: number, id2: number) => ({
        id: { in: [id1, id2, id2 + 10] },
      }),
      () => ({ title: { likeInsensitive: '%epi%' } }),
      () => ({ studio: { likeInsensitive: '%er%' } }),
    ])(
      'delete two episodes -> correct response received and messages sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_EPISODES,
          { filter: getFilter(episodeId1, episodeId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteEpisodes.affectedIds).toIncludeSameMembers([
          episodeId1,
          episodeId2,
        ]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            payload: {
              entity_id: episodeId1,
              entity_type: 'Episode',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'episodes',
            },
          },
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            payload: {
              entity_id: episodeId2,
              entity_type: 'Episode',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'episodes',
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
      'delete using filters that find no episodes -> message is not sent and response is empty',
      async (getFilter) => {
        // Act
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_EPISODES,
          { filter: getFilter(episodeId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteEpisodes.affectedIds).toEqual([]);
        expect(messages).toEqual([]);
      },
    );
  });
});
