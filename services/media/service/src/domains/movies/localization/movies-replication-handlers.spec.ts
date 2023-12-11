import { LocalizationServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { movies } from 'zapatos/schema';
import { Config, InternalErrors } from '../../../common';
import { createTestConfig } from '../../../tests/test-utils';
import { ReplicationOperationHandlers } from '../../common';
import { LOCALIZATION_MOVIE_TYPE } from './constants';
import { moviesReplicationHandlers } from './movies-replication-handlers';

describe('moviesReplicationHandlers', () => {
  let config: Config;
  let handlers: ReplicationOperationHandlers;
  const defaultMovie: Partial<movies.JSONSelectable> = {
    id: 1,
    title: 'Test Title',
    description: 'Test Description',
  };

  beforeAll(async () => {
    config = createTestConfig();
    handlers = moviesReplicationHandlers(config);
  });

  describe('insertHandler', () => {
    it('undefined is passed -> error is thrown', async () => {
      // Act
      const error = await rejectionOf(handlers.insertHandler(undefined));

      // Assert
      expect(error).toMatchObject({
        message:
          'The data was not provided for the table "movies". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it.each([
      [{}, 'id'],
      [{ id: 'test' }, 'title'],
    ])(
      'incomplete movie %p is passed -> error is thrown for column %p',
      async (movie, missingColumn) => {
        // Act
        const error = await rejectionOf(handlers.insertHandler(movie));

        // Assert
        expect(error).toMatchObject({
          message: `The column "${missingColumn}" of the table "movies" is required for localization, but was not found.`,
          code: InternalErrors.ReplicaColumnNotFound.code,
        });
      },
    );

    it('movie is inserted -> upsert message data is returned', async () => {
      // Act
      const result = await handlers.insertHandler(defaultMovie);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultMovie.id!.toString(),
          entity_title: defaultMovie.title,
          entity_type: LOCALIZATION_MOVIE_TYPE,
          fields: {
            description: defaultMovie.description,
            title: defaultMovie.title,
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
            'The data was not provided for the table "movies". Have you set `REPLICA IDENTITY full` for it?',
          code: InternalErrors.ReplicaDataNotFound.code,
        });
      },
    );

    it('movie is updated, but properties remains the same -> undefined is returned, localization does not require an update', async () => {
      // Act
      const result = await handlers.updateHandler(defaultMovie, defaultMovie);

      // Assert
      expect(result).toBeUndefined();
    });

    it('movie is updated, properties remains the same, but context is passed -> upsert message data with context is returned', async () => {
      // Arrange
      const context = { ingestItemId: 1 };
      const contextHandlers = moviesReplicationHandlers(config, context);

      // Act
      const result = await contextHandlers.updateHandler(
        defaultMovie,
        defaultMovie,
      );

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultMovie.id!.toString(),
          entity_title: defaultMovie.title,
          entity_type: LOCALIZATION_MOVIE_TYPE,
          fields: {},
          image_id: undefined,
          service_id: config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
        messageContext: context,
      });
    });

    it.each([
      [{ title: 'updated' }, undefined],
      [{ description: 'updated' }, undefined],
      [{ title: 'updated', description: 'updated' }, undefined],
      [
        { title: 'updated', description: 'updated', synopsis: 'updated' },
        { ingestItemId: 2 },
      ],
    ])(
      'movie is updated, changing properties %p -> upsert message data is returned',
      async (updated, messageContext) => {
        // Arrange
        const contextHandlers = moviesReplicationHandlers(
          config,
          messageContext,
        );

        // Act
        const updatedMovie = {
          ...defaultMovie,
          ...updated,
        };
        const result = await contextHandlers.updateHandler(
          updatedMovie,
          defaultMovie,
        );

        // Assert
        expect(result).toEqual({
          payload: {
            entity_id: defaultMovie.id!.toString(),
            entity_title: updatedMovie.title,
            entity_type: LOCALIZATION_MOVIE_TYPE,
            fields: updated,
            image_id: undefined,
            service_id: config.serviceId,
          },
          settings:
            LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
          messageContext,
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
          'The data was not provided for the table "movies". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it('movie is deleted -> delete message data is returned', async () => {
      // Act
      const result = await handlers.deleteHandler(defaultMovie);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultMovie.id!.toString(),
          entity_type: LOCALIZATION_MOVIE_TYPE,
          service_id: config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.DeleteLocalizationSourceEntity,
      });
    });
  });
});
