import { LocalizationServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { tvshow_genres } from 'zapatos/schema';
import { Config, InternalErrors } from '../../../common';
import { createTestConfig } from '../../../tests/test-utils';
import { ReplicationOperationHandlers } from '../../common';
import { LOCALIZATION_TVSHOW_GENRE_TYPE } from './constants';
import { tvshowGenresReplicationHandlers } from './tvshow-genres-replication-handlers';

describe('tvshowGenresReplicationHandlers', () => {
  let config: Config;
  let handlers: ReplicationOperationHandlers;
  let defaultTvshowGenre: Partial<tvshow_genres.JSONSelectable>;

  beforeAll(async () => {
    config = createTestConfig();
    handlers = tvshowGenresReplicationHandlers(config);
    defaultTvshowGenre = {
      id: 1,
      title: 'Test Tvshow',
    };
  });

  describe('insertHandler', () => {
    it('undefined is passed -> error is thrown', async () => {
      // Act
      const error = await rejectionOf(handlers.insertHandler(undefined));

      // Assert
      expect(error).toMatchObject({
        message:
          'The data was not provided for the table "tvshow_genres". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it.each([
      [{}, 'id'],
      [{ id: 'test' }, 'title'],
    ])(
      'incomplete tvshow genre %p is passed -> error is thrown for column %p',
      async (tvshowGenre, missingColumn) => {
        // Act
        const error = await rejectionOf(handlers.insertHandler(tvshowGenre));

        // Assert
        expect(error).toMatchObject({
          message: `The column "${missingColumn}" of the table "tvshow_genres" is required for localization, but was not found.`,
          code: InternalErrors.ReplicaColumnNotFound.code,
        });
      },
    );

    it('tvshow genre is inserted -> upsert message data is returned', async () => {
      // Act
      const result = await handlers.insertHandler(defaultTvshowGenre);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultTvshowGenre.id?.toString(),
          entity_title: defaultTvshowGenre.title,
          entity_type: LOCALIZATION_TVSHOW_GENRE_TYPE,
          fields: {
            title: defaultTvshowGenre.title,
          },
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
            'The data was not provided for the table "tvshow_genres". Have you set `REPLICA IDENTITY full` for it?',
          code: InternalErrors.ReplicaDataNotFound.code,
        });
      },
    );

    it('tvshow genre is updated, but properties remains the same -> undefined is returned, localization does not require an update', async () => {
      // Act
      const result = await handlers.updateHandler(
        defaultTvshowGenre,
        defaultTvshowGenre,
      );

      // Assert
      expect(result).toBeUndefined();
    });

    it('tvshow genre title is updated -> upsert message data is returned', async () => {
      // Arrange
      const updatedTvshowGenre = { ...defaultTvshowGenre, title: 'updated' };

      // Act
      const result = await handlers.updateHandler(
        updatedTvshowGenre,
        defaultTvshowGenre,
      );

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultTvshowGenre.id?.toString(),
          entity_title: updatedTvshowGenre.title,
          entity_type: LOCALIZATION_TVSHOW_GENRE_TYPE,
          fields: { title: 'updated' },
          service_id: config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
      });
    });
  });

  describe('deleteHandler', () => {
    it('undefined is passed -> error is thrown', async () => {
      // Act
      const error = await rejectionOf(handlers.deleteHandler(undefined));

      // Assert
      expect(error).toMatchObject({
        message:
          'The data was not provided for the table "tvshow_genres". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it('tvshow genre is deleted -> delete message data is returned', async () => {
      // Act
      const result = await handlers.deleteHandler(defaultTvshowGenre);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultTvshowGenre.id?.toString(),
          entity_type: LOCALIZATION_TVSHOW_GENRE_TYPE,
          service_id: config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.DeleteLocalizationSourceEntity,
      });
    });
  });
});
