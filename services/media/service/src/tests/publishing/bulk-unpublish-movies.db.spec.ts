import { StoreInboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import 'jest-extended';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
  UnpublishEntityCommand,
} from 'media-messages';
import { insert } from 'zapatos/db';
import * as tokenHelpers from '../../common/utils/token-utils';
import {
  createTestContext,
  createTestRequestContext,
  ITestContext,
  TestRequestContext,
} from '../test-utils';
import { UNPUBLISH_MOVIES } from './gql-constants';

describe('Movies Bulk Unpublish endpoint', () => {
  let ctx: ITestContext;
  let movieId1: number;
  let movieId2: number;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    payload: UnpublishEntityCommand;
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
    const storeInboxMessage: StoreInboxMessage = jest.fn(
      async (_aggregateId, { messageType }, payload) => {
        messages.push({
          payload: payload as PublishEntityCommand,
          messageType,
        });
      },
    );
    ctx = await createTestContext({}, undefined, storeInboxMessage);
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

  describe('unpublishMovies', () => {
    it.each([
      (id: number) => ({
        id: { in: [id + 10, id + 11, id] },
      }),
      () => ({ title: { likeInsensitive: '%valid%' } }),
      () => ({ studio: { equalTo: 'Universal' } }),
    ])(
      'unpublish one movie -> correct response received and message sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          UNPUBLISH_MOVIES,
          { filter: getFilter(movieId1) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.unpublishMovies.affectedIds).toIncludeSameMembers([
          movieId1,
        ]);
        expect(messages).toEqual([
          {
            payload: {
              entity_id: movieId1,
              entity_type: 'Movie',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'movies',
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
      () => ({ title: { likeInsensitive: '%mov%' } }),
      () => ({ studio: { likeInsensitive: '%er%' } }),
    ])(
      'unpublish two movies -> correct response received and messages sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          UNPUBLISH_MOVIES,
          { filter: getFilter(movieId1, movieId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.unpublishMovies.affectedIds).toIncludeSameMembers([
          movieId1,
          movieId2,
        ]);

        expect(messages).toEqual([
          {
            payload: {
              entity_id: movieId1,
              entity_type: 'Movie',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'movies',
            },
            messageType:
              MediaServiceMessagingSettings.UnpublishEntity.messageType,
          },
          {
            payload: {
              entity_id: movieId2,
              entity_type: 'Movie',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'movies',
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
      () => ({ title: { likeInsensitive: '%non existing%' } }),
      () => ({ publishStatus: { equalTo: 'PUBLISHED' } }),
    ])(
      'unpublish using filters that find no movies -> message is not sent and response is empty',
      async (getFilter) => {
        // Act
        // Act
        const resp = await ctx.runGqlQuery(
          UNPUBLISH_MOVIES,
          { filter: getFilter(movieId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.unpublishMovies.affectedIds).toEqual([]);
        expect(messages).toEqual([]);
      },
    );
  });
});
