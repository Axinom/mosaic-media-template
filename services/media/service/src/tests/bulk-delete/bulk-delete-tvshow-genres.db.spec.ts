import { Broker } from '@axinom/mosaic-message-bus';
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
import { DELETE_TVSHOW_GENRES } from './gql-constants';

describe('TvshowGenres Bulk Delete endpoint', () => {
  let ctx: ITestContext;
  let tvshowGenreId1: number;
  let tvshowGenreId2: number;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    message: DeleteEntityCommand;
  }[] = [];

  const createTvshowGenre = async (
    title: string,
    sortOrder: number,
  ): Promise<number> => {
    const { id } = await insert('tvshow_genres', {
      title,
      sort_order: sortOrder,
    }).run(ctx.ownerPool);
    return id;
  };

  beforeAll(async () => {
    const broker = stub<Broker>({
      publish: (key: string, message: DeleteEntityCommand) => {
        messages.push({ messageType: key, message });
      },
    });
    ctx = await createTestContext({}, broker);
    defaultRequestContext = createTestRequestContext(ctx.config.serviceId);
    jest
      .spyOn(tokenHelpers, 'getLongLivedToken')
      .mockImplementation(async () => 'test-long-lived-token');
  });

  beforeEach(async () => {
    tvshowGenreId1 = await createTvshowGenre('Valid Tvshow Genre1', 1);
    tvshowGenreId2 = await createTvshowGenre('Second Tvshow Genre2', 2);
  });

  afterEach(async () => {
    await ctx.truncate('tvshow_genres');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('deleteTvshowGenres', () => {
    it.each([
      (id: number) => ({
        id: { in: [id + 10, id + 11, id] },
      }),
      () => ({ title: { likeInsensitive: '%valid%' } }),
      () => ({ sortOrder: { equalTo: 1 } }),
    ])(
      'delete one tvshow genre -> correct response received and message sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_TVSHOW_GENRES,
          { filter: getFilter(tvshowGenreId1) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteTvshowGenres.affectedIds).toIncludeSameMembers(
          [tvshowGenreId1],
        );

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            message: {
              entity_id: tvshowGenreId1,
              entity_type: 'TvshowGenre',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'tvshow_genres',
            },
          },
        ]);
      },
    );

    it.each([
      (id1: number, id2: number) => ({
        id: { in: [id1, id2, id2 + 10] },
      }),
      () => ({ title: { likeInsensitive: '%tv%' } }),
      () => ({ sortOrder: { greaterThanOrEqualTo: 1 } }),
    ])(
      'delete two tvshow genres -> correct response received and messages sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_TVSHOW_GENRES,
          { filter: getFilter(tvshowGenreId1, tvshowGenreId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteTvshowGenres.affectedIds).toIncludeSameMembers(
          [tvshowGenreId1, tvshowGenreId2],
        );

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            message: {
              entity_id: tvshowGenreId1,
              entity_type: 'TvshowGenre',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'tvshow_genres',
            },
          },
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            message: {
              entity_id: tvshowGenreId2,
              entity_type: 'TvshowGenre',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'tvshow_genres',
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
          DELETE_TVSHOW_GENRES,
          { filter: getFilter(tvshowGenreId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteTvshowGenres.affectedIds).toEqual([]);
        expect(messages).toEqual([]);
      },
    );
  });
});
