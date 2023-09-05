import { LocalizationServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { tvshows } from 'zapatos/schema';
import { Config, InternalErrors } from '../../../common';
import { createTestConfig } from '../../../tests/test-utils';
import { ReplicationOperationHandlers } from '../../common';
import { LOCALIZATION_TVSHOW_TYPE } from './constants';
import { tvshowsReplicationHandlers } from './tvshows-replication-handlers';

describe('tvshowsReplicationHandlers', () => {
  let config: Config;
  let handlers: ReplicationOperationHandlers;
  const defaultTvshow: Partial<tvshows.JSONSelectable> = {
    id: 1,
    title: 'Test Title',
    description: 'Test Description',
  };

  beforeAll(async () => {
    config = createTestConfig();
    handlers = tvshowsReplicationHandlers(config);
  });

  describe('insertHandler', () => {
    it('undefined is passed -> error is thrown', async () => {
      // Act
      const error = await rejectionOf(handlers.insertHandler(undefined));

      // Assert
      expect(error).toMatchObject({
        message:
          'The data was not provided for the table "tvshows". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it.each([
      [{}, 'id'],
      [{ id: 'test' }, 'title'],
    ])(
      'incomplete tvshow %p is passed -> error is thrown for column %p',
      async (tvshow, missingColumn) => {
        // Act
        const error = await rejectionOf(handlers.insertHandler(tvshow));

        // Assert
        expect(error).toMatchObject({
          message: `The column "${missingColumn}" of the table "tvshows" is required for localization, but was not found.`,
          code: InternalErrors.ReplicaColumnNotFound.code,
        });
      },
    );

    it('tvshow is inserted -> upsert message data is returned', async () => {
      // Act
      const result = await handlers.insertHandler(defaultTvshow);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultTvshow.id!.toString(),
          entity_title: defaultTvshow.title,
          entity_type: LOCALIZATION_TVSHOW_TYPE,
          fields: {
            description: defaultTvshow.description,
            title: defaultTvshow.title,
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
            'The data was not provided for the table "tvshows". Have you set `REPLICA IDENTITY full` for it?',
          code: InternalErrors.ReplicaDataNotFound.code,
        });
      },
    );

    it('tvshow is updated, but properties remains the same -> undefined is returned, localization does not require an update', async () => {
      // Act
      const result = await handlers.updateHandler(defaultTvshow, defaultTvshow);

      // Assert
      expect(result).toBeUndefined();
    });

    it.each([
      { title: 'updated' },
      { description: 'updated' },
      { title: 'updated', description: 'updated' },
      { title: 'updated', description: 'updated', synopsis: 'updated' },
    ])(
      'tvshow is updated, changing properties %p -> upsert message data is returned',
      async (updated) => {
        // Act
        const updatedTvshow = {
          ...defaultTvshow,
          ...updated,
        };
        const result = await handlers.updateHandler(
          updatedTvshow,
          defaultTvshow,
        );

        // Assert
        expect(result).toEqual({
          payload: {
            entity_id: defaultTvshow.id!.toString(),
            entity_title: updatedTvshow.title,
            entity_type: LOCALIZATION_TVSHOW_TYPE,
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
          'The data was not provided for the table "tvshows". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it('tvshow is deleted -> delete message data is returned', async () => {
      // Act
      const result = await handlers.deleteHandler(defaultTvshow);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultTvshow.id!.toString(),
          entity_type: LOCALIZATION_TVSHOW_TYPE,
          service_id: config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.DeleteLocalizationSourceEntity,
      });
    });
  });
});
