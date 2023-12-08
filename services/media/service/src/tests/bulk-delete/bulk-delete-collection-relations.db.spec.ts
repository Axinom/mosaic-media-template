import { Broker } from '@axinom/mosaic-message-bus';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import {
  DeleteEntityCommand,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { insert } from 'zapatos/db';
import { collections, episodes, movies } from 'zapatos/schema';
import * as tokenHelpers from '../../common/utils/token-utils';
import {
  createTestContext,
  createTestRequestContext,
  ITestContext,
  TestRequestContext,
} from '../test-utils';
import { DELETE_COLLECTION_RELATIONS } from './gql-constants';

describe('CollectionRelations Bulk Delete endpoint', () => {
  let ctx: ITestContext;
  let collectionRelationId1: number;
  let collectionRelationId2: number;
  let movie1: movies.JSONSelectable;
  let episode1: episodes.JSONSelectable;
  let collection1: collections.JSONSelectable;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    message: DeleteEntityCommand;
  }[] = [];

  const createCollectionRelation = async (
    sortOrder: number,
    fkRelation: { episode_id: number } | { movie_id: number },
  ): Promise<number> => {
    const { id } = await insert('collection_relations', {
      collection_id: collection1.id,
      sort_order: sortOrder,
      ...fkRelation,
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

    movie1 = await insert('movies', {
      title: 'Relation Movie',
    }).run(ctx.ownerPool);
    episode1 = await insert('episodes', {
      title: 'Relation Movie',
      index: 1,
    }).run(ctx.ownerPool);
    collection1 = await insert('collections', {
      title: 'Relation Collection',
    }).run(ctx.ownerPool);
  });

  beforeEach(async () => {
    collectionRelationId1 = await createCollectionRelation(1, {
      movie_id: movie1.id,
    });
    collectionRelationId2 = await createCollectionRelation(2, {
      episode_id: episode1.id,
    });
  });

  afterEach(async () => {
    await ctx.truncate('collection_relations');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('deleteCollectionRelations', () => {
    it.each([
      (id: number) => ({
        id: { in: [id + 10, id + 11, id] },
      }),
      () => ({ movieExists: true }),
      () => ({ sortOrder: { notEqualTo: 2 } }),
    ])(
      'delete one movie license -> correct response received and message sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_COLLECTION_RELATIONS,
          { filter: getFilter(collectionRelationId1) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(
          resp?.data?.deleteCollectionRelations.affectedIds,
        ).toIncludeSameMembers([collectionRelationId1]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            message: {
              entity_id: collectionRelationId1,
              entity_type: 'CollectionRelation',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'collection_relations',
            },
          },
        ]);
      },
    );

    it.each([
      (id1: number, id2: number) => ({
        id: { in: [id1, id2, id2 + 10] },
      }),
      () => ({ or: [{ movieExists: true }, { episodeExists: true }] }),
      () => ({ tvshowExists: false }),
    ])(
      'delete two movie licenses -> correct response received and messages sent',
      async (getFilter) => {
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_COLLECTION_RELATIONS,
          { filter: getFilter(collectionRelationId1, collectionRelationId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(
          resp?.data?.deleteCollectionRelations.affectedIds,
        ).toIncludeSameMembers([collectionRelationId1, collectionRelationId2]);

        expect(messages).toIncludeSameMembers([
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            message: {
              entity_id: collectionRelationId1,
              entity_type: 'CollectionRelation',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'collection_relations',
            },
          },
          {
            messageType: MediaServiceMessagingSettings.DeleteEntity.messageType,
            message: {
              entity_id: collectionRelationId2,
              entity_type: 'CollectionRelation',
              input: undefined,
              primary_key_name: 'id',
              table_name: 'collection_relations',
            },
          },
        ]);
      },
    );

    it.each([
      (id2: number) => ({
        id: { in: [id2 + 10, id2 + 11, id2 + 12] },
      }),
      () => ({ sortOrder: { greaterThanOrEqualTo: 3 } }),
      () => ({ tvshowExists: true }),
    ])(
      'delete using filters that find no relations -> message is not sent and response is empty',
      async (getFilter) => {
        // Act
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_COLLECTION_RELATIONS,
          { filter: getFilter(collectionRelationId2) },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.deleteCollectionRelations.affectedIds).toEqual([]);
        expect(messages).toEqual([]);
      },
    );
  });
});
