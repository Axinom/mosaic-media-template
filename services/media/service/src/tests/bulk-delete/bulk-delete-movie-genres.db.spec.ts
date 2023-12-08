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
import { DELETE_MOVIE_GENRES } from './gql-constants';

describe('MovieGenres Bulk Delete endpoint', () => {
  let ctx: ITestContext;
  let movieGenreId1: number;
  let movieGenreId2: number;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    message: DeleteEntityCommand;
  }[] = [];

  const createMovieGenre = async (
    title: string,
    sortOrder: number,
  ): Promise<number> => {
    const { id } = await insert('movie_genres', {
      title,
      sort_order: sortOrder,
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
    movieGenreId1 = await createMovieGenre('Valid Movie Genre1', 1);
    movieGenreId2 = await createMovieGenre('Second Movie Genre2', 2);
  });

  afterEach(async () => {
    await ctx.truncate('movie_genres');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('deleteMovieGenres', () => {
    it.each([
      (id: number) => ({
        id: { in: [id + 10, id + 11, id] },
      }),
      () => ({ title: { likeInsensitive: '%valid%' } }),
      () => ({ sortOrder: { equalTo: 1 } }),
    ])(
      'delete one movie genre -> correct response received and message sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_MOVIE_GENRES,
          { filter: getFilter(movieGenreId1) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteMovieGenres.affectedIds).toIncludeSameMembers([
          movieGenreId1,
        ]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            message: {
              entity_id: movieGenreId1,
              entity_type: 'MovieGenre',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'movie_genres',
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
      () => ({ sortOrder: { greaterThanOrEqualTo: 1 } }),
    ])(
      'delete two movie genres -> correct response received and messages sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_MOVIE_GENRES,
          { filter: getFilter(movieGenreId1, movieGenreId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteMovieGenres.affectedIds).toIncludeSameMembers([
          movieGenreId1,
          movieGenreId2,
        ]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            message: {
              entity_id: movieGenreId1,
              entity_type: 'MovieGenre',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'movie_genres',
            },
          },
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            message: {
              entity_id: movieGenreId2,
              entity_type: 'MovieGenre',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'movie_genres',
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
      () => ({ sortOrder: { greaterThan: 3 } }),
    ])(
      'delete using filters that find no genres -> message is not sent and response is empty',
      async (getFilter) => {
        // Act
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_MOVIE_GENRES,
          { filter: getFilter(movieGenreId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteMovieGenres.affectedIds).toEqual([]);
        expect(messages).toEqual([]);
      },
    );
  });
});
