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
import { DELETE_MOVIES } from './gql-constants';

describe('Movies Bulk Delete endpoint', () => {
  let ctx: ITestContext;
  let movieId1: number;
  let movieId2: number;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    payload: DeleteEntityCommand;
  }[] = [];

  const createMovie = async (
    title: string,
    studio: string,
  ): Promise<number> => {
    const { id } = await insert('movies', {
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
    movieId1 = await createMovie('Valid Movie1', 'Universal');
    movieId2 = await createMovie('Second Movie2', 'Warner Br.');
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('deleteMovies', () => {
    it.each([
      (id: number) => ({
        id: { in: [id + 10, id + 11, id] },
      }),
      () => ({ title: { likeInsensitive: '%valid%' } }),
      () => ({ studio: { equalTo: 'Universal' } }),
    ])(
      'delete one movie -> correct response received and message sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_MOVIES,
          { filter: getFilter(movieId1) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteMovies.affectedIds).toIncludeSameMembers([
          movieId1,
        ]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            payload: {
              entity_id: movieId1,
              entity_type: 'Movie',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'movies',
            },
          },
        ]);
      },
    );

    it.each([
      (id1: number, id2: number) => ({
        id: { in: [id1, id2, id2 + 10] },
      }),
      () => ({ title: { likeInsensitive: '%mov%' } }),
      () => ({ studio: { likeInsensitive: '%er%' } }),
    ])(
      'delete two movies -> correct response received and messages sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_MOVIES,
          { filter: getFilter(movieId1, movieId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteMovies.affectedIds).toIncludeSameMembers([
          movieId1,
          movieId2,
        ]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            payload: {
              entity_id: movieId1,
              entity_type: 'Movie',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'movies',
            },
          },
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            payload: {
              entity_id: movieId2,
              entity_type: 'Movie',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'movies',
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
      'delete using filters that find no movies -> message is not sent and response is empty',
      async (getFilter) => {
        // Act
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_MOVIES,
          { filter: getFilter(movieId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteMovies.affectedIds).toEqual([]);
        expect(messages).toEqual([]);
      },
    );
  });
});
