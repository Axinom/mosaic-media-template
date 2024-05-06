import { toBeUuid } from '@axinom/mosaic-service-common';
import { StoreInboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import 'jest-extended';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
} from 'media-messages';
import { insert } from 'zapatos/db';
import * as tokenHelpers from '../../common/utils/token-utils';
import {
  createTestContext,
  createTestRequestContext,
  ITestContext,
  TestRequestContext,
} from '../test-utils';
import { PUBLISH_MOVIES } from './gql-constants';

describe('Movies Bulk Publish endpoint', () => {
  let ctx: ITestContext;
  let movieId1: number;
  let movieId2: number;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    payload: PublishEntityCommand;
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

  describe('publishMovies', () => {
    it.each([
      (id: number) => ({
        id: { in: [id + 10, id + 11, id] },
      }),
      () => ({ title: { likeInsensitive: '%valid%' } }),
      () => ({ studio: { equalTo: 'Universal' } }),
    ])(
      'publish one movie -> correct response received and message sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          PUBLISH_MOVIES,
          { filter: getFilter(movieId1) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.publishMovies.affectedIds).toIncludeSameMembers([
          movieId1,
        ]);
        expect(messages).toHaveLength(1);
        expect(messages[0]).toMatchObject({
          payload: {
            entity_id: movieId1,
            table_name: 'movies',
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
      () => ({ title: { likeInsensitive: '%mov%' } }),
      () => ({ studio: { likeInsensitive: '%er%' } }),
    ])(
      'publish two movies -> correct response received and messages sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          PUBLISH_MOVIES,
          { filter: getFilter(movieId1, movieId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.publishMovies.affectedIds).toIncludeSameMembers([
          movieId1,
          movieId2,
        ]);

        expect(messages).toHaveLength(2);
        expect(messages[0]).toMatchObject({
          payload: {
            entity_id: movieId1,
            table_name: 'movies',
            publish_options: { action: 'PUBLISH_NOW' },
          },
          messageType: MediaServiceMessagingSettings.PublishEntity.messageType,
        });
        expect(messages[1]).toMatchObject({
          payload: {
            entity_id: movieId2,
            table_name: 'movies',
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
      () => ({ title: { likeInsensitive: '%non existing%' } }),
      () => ({ publishStatus: { equalTo: 'PUBLISHED' } }),
    ])(
      'publish using filters that find no movies -> message is not sent and response is empty',
      async (getFilter) => {
        // Act
        // Act
        const resp = await ctx.runGqlQuery(
          PUBLISH_MOVIES,
          { filter: getFilter(movieId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.publishMovies.affectedIds).toEqual([]);
        expect(messages).toEqual([]);
      },
    );
  });
});
