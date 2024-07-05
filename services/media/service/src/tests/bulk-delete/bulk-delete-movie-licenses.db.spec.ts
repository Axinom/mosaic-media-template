import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import 'jest-extended';
import {
  DeleteEntityCommand,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { insert } from 'zapatos/db';
import { movies } from 'zapatos/schema';
import * as tokenHelpers from '../../common/utils/token-utils';
import {
  createTestContext,
  createTestRequestContext,
  ITestContext,
  TestRequestContext,
} from '../test-utils';
import { DELETE_MOVIES_LICENSES } from './gql-constants';

describe('MovieLicenses Bulk Delete endpoint', () => {
  let ctx: ITestContext;
  let movieLicenseId1: number;
  let movieLicenseId2: number;
  let movie1: movies.JSONSelectable;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    payload: DeleteEntityCommand;
  }[] = [];

  const createMovieLicense = async (
    start: string,
    end?: string,
  ): Promise<number> => {
    const { id } = await insert('movies_licenses', {
      movie_id: movie1.id,
      license_start: start,
      license_end: end,
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

    movie1 = await insert('movies', {
      title: 'License Movie',
    }).run(ctx.ownerPool);
  });

  beforeEach(async () => {
    movieLicenseId1 = await createMovieLicense('2020-01-01T15:05:25.000Z');
    movieLicenseId2 = await createMovieLicense(
      '2021-02-01T15:05:25.000Z',
      '2021-02-27T15:05:25.000Z',
    );
  });

  afterEach(async () => {
    await ctx.truncate('movies_licenses');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('deleteMoviesLicenses', () => {
    it.each([
      (id: number) => ({
        id: { in: [id + 10, id + 11, id] },
      }),
      () => ({ licenseEnd: { isNull: true } }),
      () => ({ licenseStart: { lessThan: '2021-02-01T15:05:25.000Z' } }),
    ])(
      'delete one movie license -> correct response received and message sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_MOVIES_LICENSES,
          { filter: getFilter(movieLicenseId1) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(
          resp?.data?.deleteMoviesLicenses.affectedIds,
        ).toIncludeSameMembers([movieLicenseId1]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            payload: {
              entity_id: movieLicenseId1,
              entity_type: 'MoviesLicense',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'movies_licenses',
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
          { licenseEnd: { isNull: true } },
          { licenseEnd: { equalTo: '2021-02-27T15:05:25.000Z' } },
        ],
      }),
      () => ({ licenseStart: { greaterThan: '2019-01-01T15:05:25.000Z' } }),
    ])(
      'delete two movie licenses -> correct response received and messages sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_MOVIES_LICENSES,
          { filter: getFilter(movieLicenseId1, movieLicenseId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(
          resp?.data?.deleteMoviesLicenses.affectedIds,
        ).toIncludeSameMembers([movieLicenseId1, movieLicenseId2]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            payload: {
              entity_id: movieLicenseId1,
              entity_type: 'MoviesLicense',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'movies_licenses',
            },
          },
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            payload: {
              entity_id: movieLicenseId2,
              entity_type: 'MoviesLicense',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'movies_licenses',
            },
          },
        ]);
      },
    );

    it.each([
      (id2: number) => ({
        id: { in: [id2 + 10, id2 + 11, id2 + 12] },
      }),
      () => ({ movieId: { equalTo: 0 } }),
      () => ({ licenseStart: { greaterThan: '2022-01-01T15:05:25.000Z' } }),
    ])(
      'delete using filters that find no licenses -> message is not sent and response is empty',
      async (getFilter) => {
        // Act
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_MOVIES_LICENSES,
          { filter: getFilter(movieLicenseId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteMoviesLicenses.affectedIds).toEqual([]);
        expect(messages).toEqual([]);
      },
    );
  });
});
