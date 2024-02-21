import { Broker } from '@axinom/mosaic-message-bus';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { toBeUuid } from '@axinom/mosaic-service-common';
import { stub } from 'jest-auto-stub';
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
import { CREATE_MOVIE_SNAPSHOTS } from './gql-constants';

describe('Bulk Create Movie Snapshots endpoint', () => {
  let ctx: ITestContext;
  let movieId1: number;
  let movieId2: number;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    message: PublishEntityCommand;
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
    const broker = stub<Broker>({
      publish: (
        _id: string,
        { messageType }: MessagingSettings,
        message: PublishEntityCommand,
      ) => {
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
      'create snapshot for one movie -> correct response received and message sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_MOVIE_SNAPSHOTS,
          { filter: getFilter(movieId1) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(
          resp?.data?.createMovieSnapshots.affectedIds,
        ).toIncludeSameMembers([movieId1]);
        expect(messages).toHaveLength(1);
        expect(messages[0]).toMatchObject({
          message: {
            entity_id: movieId1,
            table_name: 'movies',
            publish_options: { action: 'NO_PUBLISH' },
          },
          messageType: MediaServiceMessagingSettings.PublishEntity.messageType,
        });
        toBeUuid(messages[0].message.job_id as string);
      },
    );

    it.each([
      (id1: number, id2: number) => ({
        id: { in: [id1, id2, id2 + 10] },
      }),
      () => ({ title: { likeInsensitive: '%mov%' } }),
      () => ({ studio: { likeInsensitive: '%er%' } }),
    ])(
      'create snapshot for two movies -> correct response received and messages sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_MOVIE_SNAPSHOTS,
          { filter: getFilter(movieId1, movieId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(
          resp?.data?.createMovieSnapshots.affectedIds,
        ).toIncludeSameMembers([movieId1, movieId2]);

        expect(messages).toHaveLength(2);
        expect(messages[0]).toMatchObject({
          message: {
            entity_id: movieId1,
            table_name: 'movies',
            publish_options: { action: 'NO_PUBLISH' },
          },
          messageType: MediaServiceMessagingSettings.PublishEntity.messageType,
        });
        expect(messages[1]).toMatchObject({
          message: {
            entity_id: movieId2,
            table_name: 'movies',
            publish_options: { action: 'NO_PUBLISH' },
          },
          messageType: MediaServiceMessagingSettings.PublishEntity.messageType,
        });
        toBeUuid(messages[0].message.job_id as string);
        toBeUuid(messages[1].message.job_id as string);
      },
    );

    it.each([
      (id2: number) => ({
        id: { in: [id2 + 10, id2 + 11, id2 + 12] },
      }),
      () => ({ title: { likeInsensitive: '%non existing%' } }),
      () => ({ publishStatus: { equalTo: 'PUBLISHED' } }),
    ])(
      'create snapshot using filters that find no movies -> message is not sent and response is empty',
      async (getFilter) => {
        // Act
        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_MOVIE_SNAPSHOTS,
          { filter: getFilter(movieId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.createMovieSnapshots.affectedIds).toEqual([]);
        expect(messages).toEqual([]);
      },
    );
  });
});
