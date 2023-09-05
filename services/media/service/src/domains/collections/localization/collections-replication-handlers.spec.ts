import { LocalizationServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { collections } from 'zapatos/schema';
import { Config, InternalErrors } from '../../../common';
import { createTestConfig } from '../../../tests/test-utils';
import { ReplicationOperationHandlers } from '../../common';
import { collectionsReplicationHandlers } from './collections-replication-handlers';
import { LOCALIZATION_COLLECTION_TYPE } from './constants';

describe('collectionsReplicationHandlers', () => {
  let config: Config;
  let handlers: ReplicationOperationHandlers;
  const defaultCollection: Partial<collections.JSONSelectable> = {
    id: 1,
    title: 'Test Title',
    description: 'Test Description',
  };

  beforeAll(async () => {
    config = createTestConfig();
    handlers = collectionsReplicationHandlers(config);
  });

  describe('insertHandler', () => {
    it('undefined is passed -> error is thrown', async () => {
      // Act
      const error = await rejectionOf(handlers.insertHandler(undefined));

      // Assert
      expect(error).toMatchObject({
        message:
          'The data was not provided for the table "collections". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it.each([
      [{}, 'id'],
      [{ id: 'test' }, 'title'],
    ])(
      'incomplete collection %p is passed -> error is thrown for column %p',
      async (collection, missingColumn) => {
        // Act
        const error = await rejectionOf(handlers.insertHandler(collection));

        // Assert
        expect(error).toMatchObject({
          message: `The column "${missingColumn}" of the table "collections" is required for localization, but was not found.`,
          code: InternalErrors.ReplicaColumnNotFound.code,
        });
      },
    );

    it('collection is inserted -> upsert message data is returned', async () => {
      // Act
      const result = await handlers.insertHandler(defaultCollection);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultCollection.id!.toString(),
          entity_title: defaultCollection.title,
          entity_type: LOCALIZATION_COLLECTION_TYPE,
          fields: {
            description: defaultCollection.description,
            title: defaultCollection.title,
          },
          image_id: undefined,
          service_id: config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
      });
    });
  });

  describe('updateHandler', () => {
    it.each([
      [undefined, undefined],
      [
        {
          id: 'test',
          title: 'test',
        },
        undefined,
      ],
      [
        undefined,
        {
          id: 'test',
          title: 'test',
        },
      ],
    ])(
      'undefined is passed for new, old, or both -> error is thrown, checking that assertion works for both inputs',
      async (first, second) => {
        // Act
        const error = await rejectionOf(handlers.updateHandler(first, second));

        // Assert
        expect(error).toMatchObject({
          message:
            'The data was not provided for the table "collections". Have you set `REPLICA IDENTITY full` for it?',
          code: InternalErrors.ReplicaDataNotFound.code,
        });
      },
    );

    it('collection is updated, but properties remains the same -> undefined is returned, localization does not require an update', async () => {
      // Act
      const result = await handlers.updateHandler(
        defaultCollection,
        defaultCollection,
      );

      // Assert
      expect(result).toBeUndefined();
    });

    it.each([
      { title: 'updated' },
      { description: 'updated' },
      { title: 'updated', description: 'updated' },
      { title: 'updated', description: 'updated', synopsis: 'updated' },
    ])(
      'collection is updated, changing properties %p -> upsert message data is returned',
      async (updated) => {
        // Act
        const updatedCollection = {
          ...defaultCollection,
          ...updated,
        };
        const result = await handlers.updateHandler(
          updatedCollection,
          defaultCollection,
        );

        // Assert
        expect(result).toEqual({
          payload: {
            entity_id: defaultCollection.id!.toString(),
            entity_title: updatedCollection.title,
            entity_type: LOCALIZATION_COLLECTION_TYPE,
            fields: updated,
            image_id: undefined,
            service_id: config.serviceId,
          },
          settings:
            LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
        });
      },
    );
  });

  describe('deleteHandler', () => {
    it('undefined is passed -> error is thrown', async () => {
      // Act
      const error = await rejectionOf(handlers.deleteHandler(undefined));

      // Assert
      expect(error).toMatchObject({
        message:
          'The data was not provided for the table "collections". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it('collection is deleted -> delete message data is returned', async () => {
      // Act
      const result = await handlers.deleteHandler(defaultCollection);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultCollection.id!.toString(),
          entity_type: LOCALIZATION_COLLECTION_TYPE,
          service_id: config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.DeleteLocalizationSourceEntity,
      });
    });
  });
});
