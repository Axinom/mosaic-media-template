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
import { DELETE_SEASONS } from './gql-constants';

describe('Seasons Bulk Delete endpoint', () => {
  let ctx: ITestContext;
  let seasonId1: number;
  let seasonId2: number;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    message: DeleteEntityCommand;
  }[] = [];

  const createSeason = async (
    index: number,
    studio: string,
  ): Promise<number> => {
    const { id } = await insert('seasons', {
      studio,
      publish_status: 'NOT_PUBLISHED',
      index,
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
    seasonId1 = await createSeason(1, 'Universal');
    seasonId2 = await createSeason(2, 'Warner Br.');
  });

  afterEach(async () => {
    await ctx.truncate('seasons');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('deleteSeasons', () => {
    it.each([
      (id: number) => ({
        id: { in: [id + 10, id + 11, id] },
      }),
      () => ({ index: { equalTo: 1 } }),
      () => ({ studio: { equalTo: 'Universal' } }),
    ])(
      'delete one season -> correct response received and message sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_SEASONS,
          { filter: getFilter(seasonId1) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteSeasons.affectedIds).toIncludeSameMembers([
          seasonId1,
        ]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            message: {
              entity_id: seasonId1,
              entity_type: 'Season',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'seasons',
            },
          },
        ]);
      },
    );

    it.each([
      (id1: number, id2: number) => ({
        id: { in: [id1, id2, id2 + 10] },
      }),
      () => ({ index: { greaterThanOrEqualTo: 1 } }),
      () => ({ studio: { likeInsensitive: '%er%' } }),
    ])(
      'delete two seasons -> correct response received and messages sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_SEASONS,
          { filter: getFilter(seasonId1, seasonId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteSeasons.affectedIds).toIncludeSameMembers([
          seasonId1,
          seasonId2,
        ]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            message: {
              entity_id: seasonId1,
              entity_type: 'Season',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'seasons',
            },
          },
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            message: {
              entity_id: seasonId2,
              entity_type: 'Season',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'seasons',
            },
          },
        ]);
      },
    );

    it.each([
      (id2: number) => ({
        id: { in: [id2 + 10, id2 + 11, id2 + 12] },
      }),
      () => ({ index: { equalTo: 0 } }),
      () => ({ publishStatus: { equalTo: 'PUBLISHED' } }),
    ])(
      'delete using filters that find no seasons -> message is not sent and response is empty',
      async (getFilter) => {
        // Act
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_SEASONS,
          { filter: getFilter(seasonId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteSeasons.affectedIds).toEqual([]);
        expect(messages).toEqual([]);
      },
    );
  });
});
