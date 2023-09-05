import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { LocalizationServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { v4 as uuid } from 'uuid';
import { insert } from 'zapatos/db';
import { collections_images } from 'zapatos/schema';
import { InternalErrors } from '../../../common';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../../tests/test-utils';
import { ReplicationOperationHandlers } from '../../common';
import { collectionsImagesReplicationHandlers } from './collections-images-replication-handlers';
import { LOCALIZATION_COLLECTION_TYPE } from './constants';

describe('collectionsImagesReplicationHandlers', () => {
  let ctx: ITestContext;
  let user: AuthenticatedManagementSubject;
  let handlers: ReplicationOperationHandlers;
  let defaultImage: Partial<collections_images.JSONSelectable>;

  beforeAll(async () => {
    ctx = await createTestContext();
    handlers = collectionsImagesReplicationHandlers(ctx.config, ctx.ownerPool);
    user = createTestUser(ctx.config.serviceId, { name: 'TestUser' });
    defaultImage = {
      collection_id: 1,
      image_id: uuid(),
      image_type: 'COVER',
    };
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('insertHandler', () => {
    it('undefined is passed -> error is thrown', async () => {
      // Act
      const error = await rejectionOf(handlers.insertHandler(undefined));

      // Assert
      expect(error).toMatchObject({
        message:
          'The data was not provided for the table "collections_images". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it.each([
      [{}, 'collection_id'],
      [{ collection_id: 'test' }, 'image_id'],
      [{ collection_id: 'test', image_id: 'test' }, 'image_type'],
    ])(
      'incomplete image relation %p is passed -> error is thrown for column %p',
      async (image, missingColumn) => {
        // Act
        const error = await rejectionOf(handlers.insertHandler(image));

        // Assert
        expect(error).toMatchObject({
          message: `The column "${missingColumn}" of the table "collections_images" is required for localization, but was not found.`,
          code: InternalErrors.ReplicaColumnNotFound.code,
        });
      },
    );

    it('image relation is inserted -> upsert message data is returned', async () => {
      // Act
      const result = await handlers.insertHandler(defaultImage);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultImage.collection_id!.toString(),
          entity_title: undefined,
          entity_type: LOCALIZATION_COLLECTION_TYPE,
          fields: {},
          image_id: defaultImage.image_id,
          service_id: ctx.config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
      });
    });
  });

  describe('updateHandler', () => {
    it('undefined is passed for new -> error is thrown', async () => {
      // Act
      const error = await rejectionOf(
        handlers.updateHandler(undefined, undefined),
      );

      // Assert
      expect(error).toMatchObject({
        message:
          'The data was not provided for the table "collections_images". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    // Upsert message is sent unconditionally on update, syncing the new image_id
    it('image relation is updated -> upsert message data is returned', async () => {
      // Act
      const result = await handlers.updateHandler(defaultImage, undefined);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultImage.collection_id!.toString(),
          entity_title: undefined,
          entity_type: LOCALIZATION_COLLECTION_TYPE,
          fields: {},
          image_id: defaultImage.image_id,
          service_id: ctx.config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
      });
    });
  });

  describe('deleteHandler', () => {
    let collectionId: number;
    beforeEach(async () => {
      await ctx.executeGqlSql(user, async (txn) => {
        collectionId = (
          await insert('collections', {
            title: 'collection2',
          }).run(txn)
        ).id;
      });
    });

    afterEach(async () => {
      await ctx.truncate('collections');
    });

    it('undefined is passed -> error is thrown', async () => {
      // Act
      const error = await rejectionOf(handlers.deleteHandler(undefined));

      // Assert
      expect(error).toMatchObject({
        message:
          'The data was not provided for the table "collections_images". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it('image relation is deleted -> delete message data is returned', async () => {
      // Act
      const result = await handlers.deleteHandler({
        ...defaultImage,
        collection_id: collectionId,
      });

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: collectionId!.toString(),
          entity_title: undefined,
          entity_type: LOCALIZATION_COLLECTION_TYPE,
          fields: {},
          image_id: null,
          service_id: ctx.config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
      });
    });

    it('image relation cascade-deleted, collections no longer exist -> undefined is returned, collections delete handles the localization sync', async () => {
      // Arrange
      await ctx.truncate('collections');

      // Act
      const result = await handlers.deleteHandler({
        ...defaultImage,
        collection_id: collectionId,
      });

      // Assert
      expect(result).toBeUndefined();
    });
  });
});
